import boto3
import json
import os

def seed_data():
    # Initialize DynamoDB resource
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1') # Update region
    table = dynamodb.Table('YourTableName') # Update to your actual table name

    # Load your JSON file
    with open('seed/data.json') as f:
        data = json.load(f)

    # Use batch_writer to handle multiple items efficiently
    with table.batch_writer() as batch:
        for item in data['productDetails']:
            # Convert ID to string if your Partition Key is a String
            item['id'] = str(item['id']) 
            batch.put_item(Item=item)
    
    print(f"Successfully seeded {len(data['productDetails'])} items.")

if __name__ == "__main__":
    seed_data()
