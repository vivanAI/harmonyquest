from fastapi import FastAPI
from app.models import models  # Ensure models are imported
from app.seed import seed
from app.routes import lesson, user
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    seed()
    yield

app = FastAPI(title="Harmony Quest API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to the Harmony Quest API!"}

app.include_router(lesson.router)
app.include_router(user.router) 