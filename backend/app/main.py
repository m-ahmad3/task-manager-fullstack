from fastapi import FastAPI
from .db import engine, Base

app=FastAPI(title="Task-Manager-API")

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {'msg': "Task Manager API is running perfectly!"}
