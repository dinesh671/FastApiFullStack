from fastapi import FastAPI


app = FastAPI()

@app.get('/')
def auth():
    
    return {'message' : 'user auth'}