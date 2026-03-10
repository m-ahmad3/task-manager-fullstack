from fastapi import APIRouter, Depends, HTTPException, Body, status
from sqlalchemy.orm.session import Session
from ..auth import get_current_user
from .. import crud, schemas, models
from ..db import get_db

rt=APIRouter()

@rt.get('/', response_model=list[schemas.CategoryResponse])
def list_categories(db:Session=Depends(get_db), current_user:models.User=Depends(get_current_user)):
    return crud.get_categories(db, current_user.id)

@rt.post('/', status_code=status.HTTP_201_CREATED, response_model=schemas.CategoryResponse)
def create_category(new_cat:schemas.CategoryCreate, current_user:models.User=Depends(get_current_user), db:Session=Depends(get_db)):
    # Faced issue of non-default arg
    return crud.create_category(db,new_cat, current_user.id)

@rt.delete('/{category_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id:int, db:Session=Depends(get_db), current_user:models.User=Depends(get_current_user)):
    d=crud.delete_category(db,category_id, current_user.id)
    if not d:
        raise HTTPException(status_code=404, detail="This Category doesn't exist")