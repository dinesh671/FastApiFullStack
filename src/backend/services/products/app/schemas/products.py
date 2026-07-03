from pydantic import BaseModel, Field
from typing import Optional, List

class Rating(BaseModel):
    rate: float | None = None
    count: str | None = None

class ProductBase(BaseModel):
    title:str | None=None
    price:float | None = None
    description:str | None = None
    category:str | None = None
    image:str | None = None
    rating:Rating | None = None
    stock:int | None = None