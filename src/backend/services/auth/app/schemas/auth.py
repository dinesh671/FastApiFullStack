from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserCreate(BaseModel):
    email:EmailStr = Field(..., description="The email of the user")
    password:str = Field(..., description="The password of the user")
    Confirm_password:str = Field(..., description="The confirm password of the user")
    name:str = Field(..., description="The name of the user")
    phone:Optional[str] = Field(None, description="The phone number of the user")
    orders:Optional[list] = Field(None, description="The orders of the user")
    Picture:Optional[str] = Field(None, description="The picture of the user")

class UserLogin(BaseModel):
    email:EmailStr = Field(..., description="The email of the user")
    password:str = Field(..., description="The password of the user")
