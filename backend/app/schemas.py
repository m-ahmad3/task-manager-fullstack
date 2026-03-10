from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import date, datetime


class CategoryCreate(BaseModel):
    name: str =Field(...,max_length=50, examples=["Work"])

class CategoryResponse(BaseModel):
    id:int
    name:str
    class config:
        from_attributes=True

class TaskCreate(BaseModel):
    title:str=Field(...,max_length=100)
    description:Optional[str]=Field(None)
    due_date:Optional[date]=Field(None,examples=["2025-12-31"])
    priority:str=Field("medium", pattern="^(low|medium|high)$")
    category_id:Optional[int]=None

class TaskReorder(BaseModel):
    task_ids:list[int]=Field(..., examples=[[3, 1, 2]])

class TaskUpdate(BaseModel):
    title:Optional[str]=Field(None,max_length=100)
    description:Optional[str]=None
    due_date:Optional[date]=None
    priority:Optional[str]=Field(None, pattern="^(low|medium|high)$")
    category_id:Optional[int]=None
    is_completed:Optional[bool]=None

class TaskResponse(BaseModel):
    id:int
    title:str
    description:Optional[str]=None
    due_date:Optional[date]=None
    priority:str
    category_id:Optional[int]
    is_completed:bool
    created_at:datetime
    updated_at:datetime
    category:Optional[CategoryResponse]=None
    category_id:Optional[int]=None
    
    class config:
        from_attribute=True

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, examples=['ahmad'])
    email:str=Field(..., examples=["ahmad@example.com"])
    password: str =Field(..., min_length=6)

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    class config:
        from_attributes=True

class UserLogin(BaseModel):
    username:str
    password:str

class Token(BaseModel):
    access_token:str
    token_type:str="bearer"

class PaginatedTasks(BaseModel):
    tasks:list[TaskResponse]
    total:int
    page:int
    per_page:int
    total_pages:int
