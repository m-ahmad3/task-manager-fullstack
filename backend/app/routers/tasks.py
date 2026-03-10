from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional

from .. import crud, schemas
from ..db import get_db

rt=APIRouter()

@rt.get('/', response_model=schemas.TaskResponse)
def list_tasks(status:Optional[str]=None,
              category_id:Optional[int]=None, sort:Optional[str]="created_at",
              order: Optional[str]='desc', db:Session=Depends(get_db)):
    return crud.get_tasks(db, status=status, category_id=category_id, sort=sort, order=order)

@rt.get('/{task_id}', response_model=schemas.TaskResponse)
def get_task_(task_id:int, db:Session=Depends(get_db)):
    t=crud.get_task_id(db,task_id)
    if not t:
        raise HTTPException(status_code=404, detail="Task not found :(")
    return t

@rt.post('/', status_code=status.HTTP_201_CREATED, response_model=schemas.TaskCreate)
def create_task(task:schemas.TaskCreate,db:Session=Depends(get_db)):
    return crud.create_task(db, task)

@rt.put('/{task_id}', response_model=schemas.TaskUpdate)
def update_task(task_id:int, updatedTask:schemas.TaskUpdate, db:Session=Depends(get_db)):
    t=crud.update_task(db, task_id, updatedTask)
    if not t:
        raise HTTPException(status_code=404, detail="Task not found")
    return t

@rt.delete('/{task_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id:int, db:Session=Depends(get_db)):
    d=crud.delete_task(db, task_id)
    if not d:
        raise HTTPException(status_code=404, detail="Task not found")
    return d


@rt.patch('/{task_id}/complete')
def toggle_complete(task_id:int, db:Session=Depends(get_db)):
    t=crud.toggle_complete(db, task_id)
    if not t:
        raise HTTPException(status_code=404, detail="Task not found")
    return t