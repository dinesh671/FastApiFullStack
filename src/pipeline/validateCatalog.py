import json
import boto3
from piplineModels import adapter
from pydantic import BaseModel, ValidationError, TypeAdapter
from typing import List

class ratings(BaseModel):
    rate: float
    count: int

class productModels(BaseModel):
    title: str
    price: float
    description:str
    category: str
    image:str
    rating: ratings 



adapter =TypeAdapter(List[productModels])


def handler(event,context):
    bucket = event['detail']['bucket']['name']
    key = event['detail']['object']['key']

    s3 = boto3.resource('s3')
    response = s3.get_object(Bucket=bucket, Key=key)
    body = response['Boday'].read().decode('utf-8')
    records = json.loads(body)

    try:
        adapter = TypeAdapter(List[productModels])
        validated = adapter.validate_python(records)
    except ValidationError as e:
        raise Exception(f"Validation failed: {e.json()}")

    return {
        'records': [item.model_dump() for item in validated],
        'count': len(validated)
    }