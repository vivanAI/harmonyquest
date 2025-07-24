from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Lesson, User, XPTransaction
from app.schemas.schemas import LessonResponse
from pydantic import BaseModel
from typing import Any, Dict, List
import re

router = APIRouter(prefix="/lessons", tags=["lessons"])

def slugify(title):
    return re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')

class LessonCompleteRequest(BaseModel):
    user_id: int
    answers: Dict[str, Any]

class LessonCompleteResponse(BaseModel):
    correct: bool
    xp_awarded: int
    new_streak: int
    total_xp: int
    feedback: str

@router.post("/{lesson_id}/complete", response_model=LessonCompleteResponse)
def complete_lesson(lesson_id: int, req: LessonCompleteRequest, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    user = db.query(User).filter(User.id == req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Simple answer check (assumes answer_key and answers are dicts with same keys)
    correct = lesson.answer_key == req.answers
    xp_awarded = lesson.xp_reward if correct else 0

    # Update XP and streak if correct
    feedback = "Correct!" if correct else "Incorrect. Try again!"
    if correct:
        user.xp += xp_awarded
        user.streak_count += 1
        db.add(XPTransaction(user_id=user.id, source="lesson", value=xp_awarded, lesson_id=lesson.id))
    else:
        user.streak_count = 0
    db.commit()
    db.refresh(user)
    return LessonCompleteResponse(
        correct=correct,
        xp_awarded=xp_awarded,
        new_streak=user.streak_count,
        total_xp=user.xp,
        feedback=feedback
    )

@router.get("/", response_model=List[dict])
def get_lessons(db: Session = Depends(get_db)):
    lessons = db.query(Lesson).all()
    result = []
    for lesson in lessons:
        lesson_data = LessonResponse.from_orm(lesson).dict()
        lesson_data['slug'] = slugify(lesson['title'] if isinstance(lesson, dict) else lesson.title)
        result.append(lesson_data)
    return result 