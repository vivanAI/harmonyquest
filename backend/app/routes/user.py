from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, Lesson, XPTransaction
from app.schemas.schemas import UserCreate, UserResponse
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.config import settings
from pydantic import BaseModel
from typing import List
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
def get_current_user(db: Session = Depends(get_db), user_id: int = 1):  # TODO: Replace with real auth
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

class LessonProgressResponse(BaseModel):
    id: int
    title: str
    slug: str
    completed: bool

def slugify(title):
    return re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')

@router.get("/me/lessons", response_model=List[LessonProgressResponse])
def get_user_lessons(db: Session = Depends(get_db), user_id: int = 1):
    lessons = db.query(Lesson).all()
    completed_lesson_ids = set(
        row.lesson_id for row in db.query(XPTransaction.lesson_id).filter(
            XPTransaction.user_id == user_id,
            XPTransaction.lesson_id != None
        ).all()
    )
    return [LessonProgressResponse(id=lesson.id, title=lesson.title, slug=slugify(lesson.title), completed=lesson.id in completed_lesson_ids) for lesson in lessons] 