from typing import Optional
from sqlalchemy.orm import Session
from . import models, schemas
from .auth import hash_password

def get_categories(db:Session)->list[models.Category]:
    return db.query(models.Category).all()

def create_category(db:Session, categ:schemas.CategoryCreate)->models.Category:
    new_category=models.Category(name=categ.name)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

def delete_category(db:Session, id:int)->bool:
    d=db.query(models.Category).filter(models.Category.id==id)
    if not d:
        return False
    db.delete(d)
    db.commit()
    return True

def get_tasks(db:Session, status:Optional[str]=None,
              category_id:Optional[int]=None, sort:Optional[str]="created_at",
              order: Optional[str]='desc')->list[models.Task]:
    q=db.query(models.Task)
    if status=='completed':
        q=q.filter(models.Task.status==True)
    elif status=='pending':
        q=q.filter(models.Task.status==False)
    if category_id is not None:
        q=q.filter(models.Task.category_id==category_id)
    sortCol=getattr(models.Task, sort, models.Task.created_at)
    if order == 'asc':
        q=q.order_by(sortCol.asc())
    else:
        q=q.order_by(sortCol.desc())
    
    return q.all()

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
    task.status=not task.status
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
    u=models.User(username=user.username, email=user.email, password=user.password)
    db.add(u)
    db.commit()
    db.refresh(u)
    return u