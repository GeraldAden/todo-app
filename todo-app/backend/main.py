from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Date, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from pydantic import BaseModel
import os

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database configuration
DATABASE_URL = os.getenv('DATABASE_URL', "sqlite:///./todos.db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class Todo(Base):
    __tablename__ = "todos"
    
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, nullable=False)
    status = Column(String, default="new")
    deadline_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# Create database tables
Base.metadata.create_all(bind=engine)

# Pydantic models for request/response
class TodoCreate(BaseModel):
    description: str
    deadline_date: str

class TodoUpdate(BaseModel):
    status: str

# API endpoints
@app.get("/todos")
async def get_todos(status: str = None, order_by_deadline: bool = False):
    db = SessionLocal()
    try:
        query = db.query(Todo)
        if status:
            query = query.filter(Todo.status == status)
        if order_by_deadline:
            query = query.order_by(Todo.deadline_date)
        todos = query.all()
        return todos
    finally:
        db.close()

@app.post("/todos")
async def create_todo(todo: TodoCreate):
    db = SessionLocal()
    try:
        db_todo = Todo(
            description=todo.description,
            deadline_date=datetime.strptime(todo.deadline_date, "%Y-%m-%d").date()
        )
        db.add(db_todo)
        db.commit()
        db.refresh(db_todo)
        return db_todo
    finally:
        db.close()

@app.put("/todos/{todo_id}/status")
async def update_todo_status(todo_id: int, todo_update: TodoUpdate):
    db = SessionLocal()
    try:
        db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
        if not db_todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        if todo_update.status not in ["new", "started", "done"]:
            raise HTTPException(status_code=400, detail="Invalid status")
        db_todo.status = todo_update.status
        db.commit()
        return db_todo
    finally:
        db.close()

@app.delete("/todos/{todo_id}")
async def delete_todo(todo_id: int):
    db = SessionLocal()
    try:
        db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
        if not db_todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        db.delete(db_todo)
        db.commit()
        return {"message": "Todo deleted successfully"}
    finally:
        db.close()