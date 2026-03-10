from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone


from .db import Base

class User(Base):
    __tablename__='users'
    id=Column(Integer, primary_key=True, index=True)
    username=Column(String(50), unique=True, nullable=False, index=True)
    password=Column(String(255), nullable=False)
    created_at=Column(DateTime, default=lambda:datetime.now(timezone.utc))
    task=relationship("Task", back_populates="owner", cascade="all, delete-orphan")
    categories=relationship("Category", back_populates="owner", cascade="all, delete-orphan")

class Category(Base):
    __tablename__="categories"

    id=Column(Integer, index=True,primary_key=True)
    name=Column(String, nullable=False)
    owner=relationship("User", back_populates="categories")
    tasks=relationship("Task", back_populates="category")

class Task(Base):
    __tablename__="tasks"

    id=Column(Integer, primary_key=True, index=True)
    title=Column(String(100), nullable=False)
    description=Column(String, nullable=True)
    due_date=Column(Date, nullable=True)
    priority=Column(String(10), default="medium")
    status=Column(Boolean, default=False)
    created_at=Column(DateTime, default=lambda:datetime.now(timezone.utc))
    updated_at=Column(DateTime, default=lambda:datetime.now(timezone.utc))
    category_id=Column(Integer, ForeignKey('categories.id'), nullable=True)
    user_id=Column(Integer, ForeignKey('User.id'), nullable=False)
    user=relationship('User', back_populates='users')
    category=relationship("Category", back_populates="tasks")
    owner=relationship("User", back_populates="tasks")