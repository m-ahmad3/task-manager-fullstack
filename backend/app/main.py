from fastapi import FastAPI
from .db import engine, Base
from .routers import tasks, categories

app=FastAPI(title="Task-Manager-API")

app.include_router(tasks.rt, prefix="/api/tasks", tags=["Tasks"])
app.include_router(categories.rt, prefix="/api/categories", tags=["Categories"])


Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {'msg': "Task Manager API is running perfectly!"}
