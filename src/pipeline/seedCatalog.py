import boto3
import os
from dotenv import load_dotenv


def handler(event,context):
    event
    load_dotenv()

    s3 = boto3.resource('s3')
    table_name = os.getenv("PRODUCT_DATA")
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table()

    return {}