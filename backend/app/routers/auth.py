from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm.session import Session
from ..auth import verify_password, create_access_token
from .. import crud, schemas
from ..db import get_db

rt=APIRouter(prefix='/api/auth', tags=['Auth'])

@rt.post("/register", response_model=schemas.UserResponse,
         status_code=status.HTTP_201_CREATED)
def register(user: schemas.UserCreate, db:Session=Depends(get_db)):
    if crud.get_user_by_username(db, user.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Username Already Taken"
        )
    if crud.get_user_by_email(db, user.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email Already Registered"
        )
    return crud.create_user(db, user)

@rt.post('/login', response_model=schemas.Token)
def login(user_login:schemas.UserLogin, db:Session=Depends(get_db)):
    u=crud.get_user_by_username(db, user_login.username)
    if not u or not verify_password(user_login.password, u.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, 
                            detail="Invalid Username or Password",
                            headers={"WWW-Authenticate": "Bearer"})
    
    access_token=create_access_token(data={"sub":str(u.id)})

    return {"access_token": access_token, "token_type": "bearer"}