import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv
import os

load_dotenv()

dynamodb = boto3.resource('dynamodb')
table_name = os.environ.get('DYNAMODB_TABLE_NAME')

def db_connection():
    try:
        table = dynamodb.Table(table_name)
        return table
    except ClientError as e:
        return f"Error connecting to DynamoDB: {e}"