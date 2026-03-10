from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

SQLALCHEMY_DB_URL=os.getenv("SQLALCHEMY_DB_URL", "sqlite:///./taskmanager.db")

connect_args = {"check_same_thread": False} if "sqlite" in SQLALCHEMY_DB_URL else {}
engine = create_engine(
    SQLALCHEMY_DB_URL,  #database URL string
    connect_args=connect_args,  #extra connection arguments (SQLite-specific)
)

SessionLocal=sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base=declarative_base()

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()