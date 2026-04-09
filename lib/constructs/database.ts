import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';
import * as path from 'path';
import * as fs from 'fs';

export class ProductDatabase extends cdk.Stack {
    public readonly table: dynamodb.Table;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // 1. Define the Table
        this.table = new dynamodb.Table(this, 'ProductsTable', {
            tableName : 'ProductsData',
            partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.RETAIN,
        });

        // 2. Read the JSON Data
        const dataPath = path.join(__dirname, '../../src/seed/data.json');
        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

        // 3. Format data for DynamoDB batchWriteItem (Mapping 'id' to 'pk')
        const putRequests = rawData.map((item: any) => ({
            PutRequest: {
                Item: {
                    pk: { S: item.id.toString() },
                    title: { S: item.title },
                    price: { N: item.price.toString() },
                    description: { S: item.description },
                    category: { S: item.category },
                    image: { S: item.image },
                    rating: {
                        M: {
                            rate: { N: item.rating.rate.toString() },
                            count: { N: item.rating.count.toString() }
                        }
                    }
                }
            }
        }));

        // 4. Chunk data into groups of 25 (DynamoDB limit for batchWriteItem)
        const chunks = [];
        for (let i = 0; i < putRequests.length; i += 25) {
            chunks.push(putRequests.slice(i, i + 25));
        }

        // 5. Create a Custom Resource for each chunk
        chunks.forEach((chunk, index) => {
            new AwsCustomResource(this, `InitialSeedChunk${index}`, {
                onCreate: {
                    service: 'DynamoDB',
                    action: 'batchWriteItem',
                    parameters: {
                        RequestItems: {
                            [this.table.tableName]: chunk
                        }
                    },
                    // We add a version suffix (v2) to force a fresh attempt
                    physicalResourceId: PhysicalResourceId.of(`seed-data-chunk-${index}`),
                },
                policy: AwsCustomResourcePolicy.fromSdkCalls({
                    resources: [this.table.tableArn],
                }),
            });
        });
    }
}
