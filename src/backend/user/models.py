from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from uuid import UUID, uuid4

class Signup(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    name:str | None = None
    email:EmailStr
    password:str
    timestamp:datetime

class Address(BaseModel):
    adressLine1:str
    adressLine2:str | None = None
    landmark:str
    city:str
    State:str
    pin_code:str
    
    

class profile(Signup):
    phone:str | None =None
    addresses:dict[str,Address]= {}