from fastapi import APIRouter
from ..schemas.auth import UserLogin, UserCreate
from sqlalchemy.orm import Session

router = APIRouter()
    
@router.post("/login")
async def login(credentials: UserLogin):
    
    return {"message": "Login endpoint"}

@router.post("/register")
async def register(user: UserCreate):
    return {"message": "Register endpoint"}

@router.patch("/updateprofile")
async def update_profile():
    return {"message": "Update profile endpoint"}

