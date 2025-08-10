from fastapi import FastAPI
from app.models import models  # Ensure models are imported
from app.seed import seed
from app.routes import lesson, user
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    seed()
    yield

app = FastAPI(title="Harmony Quest API", lifespan=lifespan)

# CORS origins: read from env BACKEND_CORS_ORIGINS as comma-separated list
cors_env = os.environ.get("BACKEND_CORS_ORIGINS", "http://localhost:3000")
allow_origins = [o.strip() for o in cors_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to the Harmony Quest API!"}

app.include_router(lesson.router)
app.include_router(user.router)