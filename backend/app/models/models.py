from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, Text, Boolean, Table, JSON, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base
import enum

Base = declarative_base()

# Enums (Casing matches frontend expectations: e.g., 'MCQ', 'PENDING', etc.)
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
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)  # Use passlib (bcrypt) for hashing
    avatar = Column(String)
    xp = Column(Integer, default=0)
    badges = Column(JSON, default=list)
    streak_count = Column(Integer, default=0)
    light_dark_mode = Column(String, default="light")
    privacy_settings = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    xp_transactions = relationship("XPTransaction", back_populates="user")
    friendships = relationship("Friendship", back_populates="user", foreign_keys='Friendship.user_id')
    friends = relationship("Friendship", back_populates="friend", foreign_keys='Friendship.friend_id')
    trivia_entries = relationship("TriviaEntry", back_populates="user")
    ai_logs = relationship("AIQuestionLog", back_populates="user")

# Lesson
class Lesson(Base):
    __tablename__ = 'lessons'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    topic = Column(String, nullable=False)
    type = Column(Enum(LessonType), nullable=False)
    content = Column(JSON, nullable=False)
    answer_key = Column(JSON, nullable=False)
    xp_reward = Column(Integer, default=10)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# XPTransaction
class XPTransaction(Base):
    __tablename__ = 'xp_transactions'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    source = Column(String, nullable=False)  # e.g., 'lesson', 'trivia'
    value = Column(Integer, nullable=False)
    date = Column(DateTime(timezone=True), server_default=func.now())
    lesson_id = Column(Integer, ForeignKey('lessons.id'), nullable=True)
    trivia_entry_id = Column(Integer, ForeignKey('trivia_entries.id'), nullable=True)

    user = relationship("User", back_populates="xp_transactions")

# Friendship
class Friendship(Base):
    __tablename__ = 'friendships'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    friend_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    status = Column(Enum(FriendshipStatus), default=FriendshipStatus.PENDING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (UniqueConstraint('user_id', 'friend_id', name='_user_friend_uc'),)

    user = relationship("User", foreign_keys=[user_id], back_populates="friendships")
    friend = relationship("User", foreign_keys=[friend_id], back_populates="friends")

# TriviaChallenge
class TriviaChallenge(Base):
    __tablename__ = 'trivia_challenges'
    id = Column(Integer, primary_key=True, index=True)
    week_id = Column(String, nullable=False, unique=True)
    theme = Column(String, nullable=False)
    questions = Column(JSON, nullable=False)  # List of questions
    correct_answers = Column(JSON, nullable=False)  # List of correct answers
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# TriviaEntry
class TriviaEntry(Base):
    __tablename__ = 'trivia_entries'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    week_id = Column(String, nullable=False)
    answers = Column(JSON, nullable=False)
    score = Column(Integer, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="trivia_entries")

# Leaderboard
class Leaderboard(Base):
    __tablename__ = 'leaderboards'
    id = Column(Integer, primary_key=True, index=True)
    type = Column(Enum(LeaderboardType), nullable=False)
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    entries = relationship("LeaderboardEntry", back_populates="leaderboard")

# LeaderboardEntry
class LeaderboardEntry(Base):
    __tablename__ = 'leaderboard_entries'
    id = Column(Integer, primary_key=True, index=True)
    leaderboard_id = Column(Integer, ForeignKey('leaderboards.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    score = Column(Integer, default=0)

    leaderboard = relationship("Leaderboard", back_populates="entries")
    user = relationship("User")

# EncyclopediaEntry
class EncyclopediaEntry(Base):
    __tablename__ = 'encyclopedia_entries'
    id = Column(Integer, primary_key=True, index=True)
    category = Column(Enum(EncyclopediaCategory), nullable=False)
    group_name = Column(String, nullable=False)
    overview = Column(Text)
    beliefs = Column(Text)
    practices = Column(Text)
    festivals = Column(Text)
    etiquette = Column(Text)
    misconceptions = Column(Text)
    media = Column(JSON)  # List of image/audio URLs
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# AIQuestionLog
class AIQuestionLog(Base):
    __tablename__ = 'ai_question_logs'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    query = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="ai_logs") 