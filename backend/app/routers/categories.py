from fastapi import APIRouter, Depends, HTTPException, Body, status
from sqlalchemy.orm.session import Session

from .. import crud, schemas, models
from ..db import get_db

rt=APIRouter()

@rt.get('/', response_model=schemas.CategoryResponse)
def list_categories(db:Session=Depends(get_db)):
    return crud.get_categories(db)

@rt.post('/', status_code=status.HTTP_201_CREATED, response_model=schemas.CategoryCreate)
def create_category(new_cat:schemas.CategoryCreate, db:Session=Depends(get_db)):
    # Faced issue of non-default arg
    return crud.create_category(db,new_cat)

@rt.delete('/{category_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_content(category_id:int, db:Session=Depends(get_db)):
    d=crud.delete_category(db,category_id)
    if not d:
        raise HTTPException(status_code=404, detail="This Category doesn't exist")