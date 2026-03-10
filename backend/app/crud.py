from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from . import models, schemas
from .auth import hash_password
import math

def get_categories(db:Session, user_id:int)->list[models.Category]:
    return db.query(models.Category).filter(models.Category.user_id==user_id).order_by(models.Category.name).all()

def create_category(db:Session, categ:schemas.CategoryCreate, user_id:int)->models.Category:
    new_category=models.Category(name=categ.name, user_id=user_id)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

def delete_category(db:Session, cat_id:int, user_id:int)->bool:
    d=db.query(models.Category).filter(models.Category.id==cat_id, models.User.id==user_id).first()
    if not d:
        return False
    db.delete(d)
    db.commit()
    return True

def get_tasks(
    db: Session,
    user_id: int,
    status: Optional[str] = None,
    category_id: Optional[int] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None,
    sort: Optional[str] = "created_at",
    order: Optional[str] = "desc",
    page: int = 1,
    per_page: int = 10,
) -> schemas.PaginatedTasks:
    query = db.query(models.Task).filter(models.Task.user_id == user_id)

    if status == "completed":
        query = query.filter(models.Task.is_completed == True)
    elif status == "pending":
        query = query.filter(models.Task.is_completed == False)

    if category_id is not None:
        query = query.filter(models.Task.category_id == category_id)

    if priority is not None:
        query = query.filter(models.Task.priority == priority)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                models.Task.title.ilike(search_term),
                models.Task.description.ilike(search_term),
            )
        )

    total = query.count()

    sort_column = getattr(models.Task, sort, models.Task.created_at)
    if order == "asc":
        query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(sort_column.desc())

    total_pages = max(1, math.ceil(total / per_page))
    offset = (page - 1) * per_page
    tasks = query.offset(offset).limit(per_page).all()

    return schemas.PaginatedTasks(
        tasks=tasks,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages,
    )

def get_task_id(db:Session, id:int)->models.Task:
    return db.query(models.task).filter(models.task.id==id).first()

def create_task(db:Session, task:schemas.TaskCreate)->models.Task:
    new_task=models.Task(title=task.title, description=task.description, due_date=task.due_date, priority=task.priority, 
                         category_id=task.category_id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

def delete_task(db:Session, id:int)->bool:
    task=get_task_id(db, id)
    if not task:
        return False
    db.delete(task)
    db.commit()
    return True

def toggle_complete(db:Session, id:int)->Optional[models.Task]:
    task=get_task_id(db, id)
    if not task:
        return None
    task.is_completed=not task.is_completed
    db.commit()
    db.refresh(task)
    return task

def update_task(db:Session, id:int, upd_task:schemas.TaskUpdate)->Optional[models.Task]:
    task=get_task_id(db, id)
    if not task:
        return None
    taskData=upd_task.model_dump(exclude_unset=True)
    for key, val in taskData.items():
        setattr(task, key, val)
    
    db.commit()
    db.refresh(task)
    return task

def get_user_by_username(db:Session, username:str):
    return db.query(models.User).filter(models.User.username==username).first()

def get_user_by_email(db:Session, email:str):
    return db.query(models.User).filter(models.User.email==email).first()

def create_user(db:Session, user:schemas.UserCreate)->models.User:
    u=models.User(username=user.username, email=user.email, hashed_password=hash_password(user.password))
    db.add(u)
    db.commit()
    db.refresh(u)
    return u

def reorder_tasks(db: Session, task_ids: list[int], user_id: int) -> bool:

    for index, task_id in enumerate(task_ids):
        t = get_task_id(db, task_id, user_id)
        if t:
            t.position = index
    db.commit()
    return True