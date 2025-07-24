import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    SECRET_KEY = os.getenv("SECRET_KEY", "changeme")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))
    ALGORITHM = "HS256"
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")
    CACHE_TTL = int(os.getenv("CACHE_TTL", 300))

settings = Settings() 