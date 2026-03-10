from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from ..auth import get_current_user
from .. import crud, schemas, models
from ..db import get_db

rt=APIRouter()

@rt.get('/', response_model=schemas.PaginatedTasks)
def list_tasks(
    status_filter: Optional[str] = Query(None, alias="status"),
    category_id: Optional[int] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None,
    sort: Optional[str] = "created_at",
    order: Optional[str] = "desc",
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.get_tasks(
        db,
        user_id=current_user.id,
        status=status_filter,
        category_id=category_id,
        priority=priority,
        search=search,
        sort=sort,
        order=order,
        page=page,
        per_page=per_page,
    )

@rt.get('/{task_id}', response_model=schemas.TaskResponse)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    task=crud.get_task_id(db, task_id, current_user.id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task

@rt.post('/', status_code=status.HTTP_201_CREATED, response_model=schemas.TaskResponse)
def create_task(
    task: schemas.TaskCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.create_task(db, task, current_user.id)

@rt.put('/{task_id}', response_model=schemas.TaskResponse)
def update_task(
    task_id:int,
    updated_task:schemas.TaskUpdate,
    db:Session=Depends(get_db),
    current_user:models.User=Depends(get_current_user),
):
    t=crud.update_task(db, task_id, current_user.id, updated_task)
    if not t:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return t

@rt.delete('/{task_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    deleted=crud.delete_task(db, task_id, current_user.id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return None

@rt.patch('/{task_id}/complete', response_model=schemas.TaskResponse)
def toggle_complete(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    task=crud.toggle_complete(db, task_id, current_user.id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task

@rt.patch("/reorder", status_code=status.HTTP_200_OK)
def reorder_tasks(
    reorder: schemas.TaskReorder,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    crud.reorder_tasks(db, reorder.task_ids, current_user.id)
    return {"message": "Tasks reordered successfully"}
