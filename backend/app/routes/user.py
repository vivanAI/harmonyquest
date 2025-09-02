from fastapi import APIRouter, HTTPException, Depends, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, Lesson, XPTransaction
from app.schemas.schemas import UserCreate, UserResponse
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from app.config import settings
from pydantic import BaseModel
from typing import List, Optional
import re

router = APIRouter(prefix="/users", tags=["users"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user_id(authorization: str = Header(None), db: Session = Depends(get_db)) -> int:
    if not authorization or not authorization.startswith("Bearer "):
        print("WARNING: No authorization header provided, using user_id=1 for development")
        return 1
    
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
        print(f"Successfully authenticated user_id: {user_id}")
        return user_id
    except (JWTError, ValueError, IndexError) as e:
        print(f"WARNING: Invalid token, using user_id=1 for development. Error: {e}")
        return 1

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = pwd_context.hash(user.password)
    db_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed_pw,
        avatar=user.avatar,
        light_dark_mode=user.light_dark_mode,
        privacy_settings=user.privacy_settings
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

class LoginRequest(UserCreate):
    pass

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

@router.post("/login", response_model=LoginResponse)
def login(login: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login.email).first()
    if not user or not pwd_context.verify(login.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(user.id)})
    return LoginResponse(access_token=token, user=user)

@router.get("/me", response_model=UserResponse)
def get_current_user(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

class UserUpdateRequest(BaseModel):
    xp: Optional[int] = None
    streak_count: Optional[int] = None

class LessonCompleteRequest(BaseModel):
    lesson_slug: str
    xp_earned: int

class LessonProgressResponse(BaseModel):
    id: int
    title: str
    slug: str
    completed: bool

def slugify(title):
    return re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')

class OAuthUpsertRequest(BaseModel):
    email: str
    name: Optional[str] = None
    avatar: Optional[str] = None

@router.post("/oauth_upsert", response_model=LoginResponse)
def oauth_upsert(payload: OAuthUpsertRequest, db: Session = Depends(get_db)):
    # Find existing user by email
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        # Create a user with random password hash placeholder (not used)
        user = User(
            name=payload.name or payload.email.split('@')[0],
            email=payload.email,
            password_hash=pwd_context.hash("oauth_placeholder"),
            avatar=payload.avatar,
            light_dark_mode="light",
            privacy_settings={},
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Update profile fields if changed
        updated = False
        if payload.name and user.name != payload.name:
            user.name = payload.name
            updated = True
        if payload.avatar and user.avatar != payload.avatar:
            user.avatar = payload.avatar
            updated = True
        if updated:
            db.commit()
            db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return LoginResponse(access_token=token, user=user)

@router.put("/me", response_model=UserResponse)
def update_user_progress(update_data: UserUpdateRequest, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if update_data.xp is not None:
        user.xp = update_data.xp
    if update_data.streak_count is not None:
        user.streak_count = update_data.streak_count
    
    db.commit()
    db.refresh(user)
    return user

@router.post("/me/lessons/complete")
def complete_lesson(lesson_data: LessonCompleteRequest, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    # Find lesson by slug
    lesson = db.query(Lesson).filter(Lesson.title.ilike(f"%{lesson_data.lesson_slug.replace('-', ' ')}%")).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    # Check if lesson already completed
    existing_transaction = db.query(XPTransaction).filter(
        XPTransaction.user_id == user_id,
        XPTransaction.lesson_id == lesson.id
    ).first()
    
    if existing_transaction:
        return {"message": "Lesson already completed", "lesson_id": lesson.id}
    
    # Create XP transaction for lesson completion
    xp_transaction = XPTransaction(
        user_id=user_id,
        lesson_id=lesson.id,
        source="lesson",
        value=lesson_data.xp_earned
    )
    db.add(xp_transaction)
    
    # Update user's total XP
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.xp = (user.xp or 0) + lesson_data.xp_earned
    
    db.commit()
    return {"message": "Lesson completed successfully", "lesson_id": lesson.id, "xp_earned": lesson_data.xp_earned}

@router.post("/me/lessons/{lesson_slug}/complete")
def complete_lesson_by_slug(lesson_slug: str, xp_data: dict, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    # Find lesson by slug
    lesson = db.query(Lesson).filter(Lesson.slug == lesson_slug).first()
    if not lesson:
        # Fallback: try to find by title pattern
        lesson = db.query(Lesson).filter(Lesson.title.ilike(f"%{lesson_slug.replace('-', ' ')}%")).first()
    
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    # Check if lesson already completed
    existing_transaction = db.query(XPTransaction).filter(
        XPTransaction.user_id == user_id,
        XPTransaction.lesson_id == lesson.id
    ).first()
    
    if existing_transaction:
        return {"message": "Lesson already completed", "lesson_id": lesson.id}
    
    # Get XP earned from request body
    xp_earned = xp_data.get("xpEarned", 0)
    
    # Create XP transaction for lesson completion
    xp_transaction = XPTransaction(
        user_id=user_id,
        lesson_id=lesson.id,
        source="lesson",
        value=xp_earned
    )
    db.add(xp_transaction)
    
    # Update user's total XP
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.xp = (user.xp or 0) + xp_earned
    
    db.commit()
    return {"message": "Lesson completed successfully", "lesson_id": lesson.id, "xp_earned": xp_earned}

@router.get("/me/lessons", response_model=List[LessonProgressResponse])
def get_user_lessons(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    lessons = db.query(Lesson).all()
    completed_lesson_ids = set(
        row.lesson_id for row in db.query(XPTransaction.lesson_id).filter(
            XPTransaction.user_id == user_id,
            XPTransaction.lesson_id != None
        ).all()
    )
    return [LessonProgressResponse(id=lesson.id, title=lesson.title, slug=slugify(lesson.title), completed=lesson.id in completed_lesson_ids) for lesson in lessons] 