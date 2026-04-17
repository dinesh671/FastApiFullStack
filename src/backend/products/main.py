import os
import boto3
from botocore.exceptions import ClientError
from fastapi import FastAPI, HTTPException
from mangum import Mangum
from models import Item
# from dotenv import load_dotenv

app = FastAPI()


# Initialize DynamoDB Client
table_name = os.environ.get("TABLE_NAME")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(table_name)


@app.get("/")
def get_data(): 
    # Replace in-memory logic with DynamoDB Scan
    response = table.scan()
    return response.get("Items", [])


@app.get("/{id}")
def get_data_by_id(id: str): 
    response = table.get_item(Key={"pk": id})
    if "Item" not in response:
        raise HTTPException(status_code=404, detail="Product not found")
    return response["Item"]


@app.post("/createProducts")
async def add_products(item: Item):
    # Convert Pydantic model to dict and save
    item_dict = item.model_dump()
    item_dict["pk"] = str(item_dict.get("id"))
    table.put_item(Item=item_dict)
    return {"message": "Product created"}


@app.put("/updateproduts/{id}")
async def upadate_products(item: Item):
    response = table.get_item(Key={"pk": item.id})

    if "Item" not in response:
        raise HTTPException(status_code=404, detail="Product not found")

    return {"message": "updated the product"}


handler = Mangum(app, lifespan="off", api_gateway_base_path="/products")
