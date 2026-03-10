import os
import bcrypt
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from . import models
from .db import get_db

SECRET_KEY=os.getenv("SECRET_KEY", "MyKEY")

ALGORITHM='HS256'
ACCESS_TOKEN_TIME=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

oauth2_scheme=OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def hash_password(pas:str)->str:
    salt=bcrypt.gensalt()
    h=bcrypt.hashpw(pas.encode('utf-8'),salt)
    return h.decode('utf-8')

def verify_password(plain_p:str, hash_p:str)->bool:
    return bcrypt.checkpw(plain_p.encode('utf-8'), hash_p.encode('utf-8'))

def create_access_token(data: dict, expires_delta:Optional[timedelta]=None)->str:
    to_encode=data.copy()

    expire=datetime.now(timezone.utc)+(expires_delta or timedelta(minutes=ACCESS_TOKEN_TIME))

    to_encode.update({'exp':expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(
        token:str=Depends(oauth2_scheme),
        db:Session=Depends(get_db)
)->models.User:
    credentials_exception=HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not Validated",
        headers={"WWW-Authenticate":"Bearer"}
    )
    try:
        payload=jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id:str=payload.get('sub')
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(models.User).filter(models.User.id==int(user_id)).first()
    if user is None:
        raise credentials_exception
    return user