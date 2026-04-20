import boto3
import json
import os

def seed_data(): 
    # Initialize DynamoDB resource
    dynamodb = boto3.resource('dynamodb', region_name='ap-south-1') # Update region
    table = dynamodb.Table('ProductsData') # Update to your actual table name

    # Load your JSON file
    with open('seed/data.json') as f:
        data = json.load(f)

    # Use batch_writer to handle multiple items efficiently
    with table.batch_writer() as batch:
        for item in data:
            # Convert ID to string if your Partition Key is a String
            item['id'] = str(item['id']) 
            batch.put_item(Item=item)
    
    print(f"Successfully seeded {len(data)} items.")

if __name__ == "__main__":
    seed_data()
