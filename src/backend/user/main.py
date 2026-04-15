from fastapi import FastAPI
from pwdlib import PasswordHash
from mangum import Mangum
import os
import boto3

table_name = os.environ.get("TABLE_NAME")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(table_name | 'userData')

password_hash = PasswordHash.recommended()
DUMMY_HASH = password_hash.hash("dummypassowrd")


app = FastAPI()



def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password,hashed_password)

def get_password_hash(password):
    return password_hash.hash(password)
    


@app.post('/auth')
def auth():
    return {'message' : 'user auth'}

@app.post('/register')
def regiter():
    return {'message' : 'user auth'}



handler = Mangum(app, lifespan="off", api_gateway_base_path="/users")
