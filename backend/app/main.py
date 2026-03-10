from fastapi import FastAPI
from .db import engine, Base
from .routers import tasks, categories, auth
from fastapi.middleware.cors import CORSMiddleware
import os

app=FastAPI(title="Task-Manager-API")

cors_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"
).split(",")

app.add_middleware(
    CORSMiddleware, # This is cross origin res sharing
    allow_origins=cors_origins, allow_credentials=True,
    allow_methods=['*'], allow_headers=["*"]
)

app.include_router(auth.rt)
app.include_router(tasks.rt, prefix="/api/tasks", tags=["Tasks"])
app.include_router(categories.rt, prefix="/api/categories", tags=["Categories"])

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {'msg': "Task Manager API is running perfectly!"}
