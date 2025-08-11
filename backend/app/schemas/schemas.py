from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import enum

# Enums (should match models)
class LessonType(str, enum.Enum):
    MCQ = "MCQ"
    MATCHING = "MATCHING"
    AUDIO = "AUDIO"
    OTHER = "OTHER"

class FriendshipStatus(str, enum.Enum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"

class EncyclopediaCategory(str, enum.Enum):
    RELIGION = "Religion"
    RACE = "Race"

class LeaderboardType(str, enum.Enum):
    XP = "XP"
    TRIVIA = "TRIVIA"

# User
class UserBase(BaseModel):
    name: str
    email: EmailStr
    avatar: Optional[str] = None
    light_dark_mode: Optional[str] = "light"
    privacy_settings: Optional[Dict[str, Any]] = Field(default_factory=dict)

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    xp: int
    badges: List[Any] = []
    streak_count: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

# Lesson
class LessonBase(BaseModel):
    title: str
    topic: str
    type: LessonType
    slug: str  # Add slug field
    content: Dict[str, Any]
    answer_key: Dict[str, Any]
    xp_reward: int

class LessonCreate(LessonBase):
    pass

class LessonResponse(LessonBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# XPTransaction
class XPTransactionBase(BaseModel):
    source: str
    value: int
    lesson_id: Optional[int]
    trivia_entry_id: Optional[int]

class XPTransactionCreate(XPTransactionBase):
    pass

class XPTransactionResponse(XPTransactionBase):
    id: int
    user_id: int
    date: datetime
    class Config:
        from_attributes = True

# Friendship
class FriendshipBase(BaseModel):
    friend_id: int
    status: FriendshipStatus = FriendshipStatus.PENDING

class FriendshipCreate(FriendshipBase):
    pass

class FriendshipResponse(FriendshipBase):
    id: int
    user_id: int
    created_at: datetime
    class Config:
        from_attributes = True

# TriviaChallenge
class TriviaChallengeBase(BaseModel):
    week_id: str
    theme: str
    questions: List[Dict[str, Any]]
    correct_answers: List[Any]

class TriviaChallengeCreate(TriviaChallengeBase):
    pass

class TriviaChallengeResponse(TriviaChallengeBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# TriviaEntry
class TriviaEntryBase(BaseModel):
    week_id: str
    answers: List[Any]
    score: int

class TriviaEntryCreate(TriviaEntryBase):
    pass

class TriviaEntryResponse(TriviaEntryBase):
    id: int
    user_id: int
    timestamp: datetime
    class Config:
        from_attributes = True

# Leaderboard
class LeaderboardBase(BaseModel):
    type: LeaderboardType
    start_date: datetime
    end_date: datetime

class LeaderboardCreate(LeaderboardBase):
    pass

class LeaderboardResponse(LeaderboardBase):
    id: int
    entries: List[Any] = []
    class Config:
        from_attributes = True

# LeaderboardEntry
class LeaderboardEntryBase(BaseModel):
    user_id: int
    score: int

class LeaderboardEntryCreate(LeaderboardEntryBase):
    leaderboard_id: int

class LeaderboardEntryResponse(LeaderboardEntryBase):
    id: int
    leaderboard_id: int
    class Config:
        from_attributes = True

# EncyclopediaEntry
class EncyclopediaEntryBase(BaseModel):
    category: EncyclopediaCategory
    group_name: str
    overview: Optional[str]
    beliefs: Optional[str]
    practices: Optional[str]
    festivals: Optional[str]
    etiquette: Optional[str]
    misconceptions: Optional[str]
    media: Optional[List[Any]] = []

class EncyclopediaEntryCreate(EncyclopediaEntryBase):
    pass

class EncyclopediaEntryResponse(EncyclopediaEntryBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# AIQuestionLog
class AIQuestionLogBase(BaseModel):
    query: str
    response: str

class AIQuestionLogCreate(AIQuestionLogBase):
    user_id: Optional[int]

class AIQuestionLogResponse(AIQuestionLogBase):
    id: int
    user_id: Optional[int]
    timestamp: datetime
    class Config:
        from_attributes = True 