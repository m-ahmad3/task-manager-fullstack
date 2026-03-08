from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime


class CategoryCreate(BaseModel):
    name: str =Field(...,max_length=50)

class CategoryResponse(BaseModel):
    id:int
    name:str
    class config:
        from_attributes=True

class TaskCreate(BaseModel):
    title:str=Field(...,max_length=100)
    description:Optional[str]=None
    due_date:Optional[date]=None
    priority:str="medium"
    category_id:Optional[int]=None

class TaskUpdate(BaseModel):
    title:Optional[str]=Field(None,max_length=100)
    description:Optional[str]=None
    due_date:Optional[date]=None
    priority:Optional[str]=None
    category_id:Optional[int]=None
    status:Optional[bool]=None

class TaskResponse(BaseModel):
    id:int
    title:str
    description:Optional[str]
    due_date:Optional[date]
    priority:str
    category_id:Optional[int]
    status:bool
    created_at:datetime
    updated_at:datetime
    category:Optional[CategoryResponse]=None
    
    class config:
        from_attribute=True