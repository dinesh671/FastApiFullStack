from pydantic import BaseModel
from typing import Optional, Any

class ratings(BaseModel):
    rate: float
    count: int


class Item(BaseModel):
    title: str
    price: float
    description:str
    category: str
    image:str
    rating: ratings 




