from fastapi import FastAPI
from .db import engine, Base
from .routers import tasks, categories
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI(title="Task-Manager-API")

app.add_middleware(
    CORSMiddleware, # This is cross origin res sharing
    allow_origin=["localhost:5173"], allow_credentials=True,
    allow_methods=['*'], allow_headers=["*"]
)

app.include_router(tasks.rt, prefix="/api/tasks", tags=["Tasks"])
app.include_router(categories.rt, prefix="/api/categories", tags=["Categories"])


Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {'msg': "Task Manager API is running perfectly!"}
