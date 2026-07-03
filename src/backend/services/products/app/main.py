from fastapi import FastAPI
from .routes.products import router
app = FastAPI() 
app.include_router(router) 