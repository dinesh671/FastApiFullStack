import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
// 1. Import your new database class
import { ProductDatabase } from './database';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { execSync } from 'child_process';

interface ProductsServiceProps extends cdk.StackProps {
    httpApi: apigwv2.HttpApi;
    deployementEnv: 'dev' | 'prod';
    databaseUrl?: string;
}



export class ProductService extends cdk.Stack {
    public readonly handler: lambda.Function;

    constructor(scope: Construct, id: string, props: ProductsServiceProps) {
        super(scope, id, props);

        // 2. Initialize the Database Construct
        const database = new ProductDatabase(this, 'ProductsDatabase');
        const entryPath = path.join(process.cwd(), 'src', 'backend', 'products')

        this.handler = new lambda.Function(this, 'ProductsHandler', {

            functionName: `product-handler-${props.deployementEnv}`,
            runtime: lambda.Runtime.PYTHON_3_11,
            handler: 'products.main.handler',
            architecture: lambda.Architecture.ARM_64,
            timeout: cdk.Duration.seconds(30),
            // 3. Pass the DynamoDB Table Name to your FastAPI code
            environment: {
                TABLE_NAME: database.table.tableName,
                DEPLOYMENT_ENV: props.deployementEnv
            },
            code: lambda.Code.fromAsset(entryPath, {
                bundling: {
                    image: lambda.Runtime.PYTHON_3_11.bundlingImage, // Required by interface, but ignored if local returns true
                    local: {
                        tryBundle(outputDir: string) {
                            try {
                                // 1. Install dependencies to the CDK output directory
                                // We use --only-binary=:all: if on the same arch, or just standard install
                                execSync(`pip install -r ${path.join(entryPath, 'requirements.txt')} -t ${outputDir}`, { stdio: 'inherit' });

                                // 2. Copy the source code (main.py, etc.) to the same output directory
                                // This uses 'cp -R' to ensure subdirectories are included
                                execSync(`cp -R ${entryPath}/* ${outputDir}`, { stdio: 'inherit' });

                                return true; // Success! CDK uses this folder instead of Docker
                            } catch (e) {
                                console.error('Local bundling failed:', e);
                                return false; // Fallback to Docker (which will fail if you don't have it, but acts as a safety)
                            }
                        },
                    },
                },
            }),
        });

        const productIntegration = new HttpLambdaIntegration('ProductInt', this.handler);

        props.httpApi.addRoutes({
            path: '/products/{proxy+}',
            methods: [apigwv2.HttpMethod.ANY],
            integration: productIntegration,
        });

        // 4. Grant the Lambda permission to Read/Write to DynamoDB
        database.table.grantReadWriteData(this.handler);
    }
}
