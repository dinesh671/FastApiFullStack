import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { ProductDatabase } from './database';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

interface ProductsServiceProps extends cdk.StackProps {
    httpApi: apigwv2.HttpApi;
    deployementEnv: 'dev' | 'prod';
    databaseUrl?: string;
}



export class ProductService extends cdk.Stack {
    public readonly handler: lambda.Function;

    constructor(scope: Construct, id: string, props: ProductsServiceProps) {
        super(scope, id, props);

        const database = new ProductDatabase(this, 'ProductsDatabase');
        
        // Point to the folder where GitHub Actions will install the libraries
        const entryPath = path.join(process.cwd(), 'src', 'backend','products');

        this.handler = new lambda.Function(this, 'ProductsHandler', {
            functionName: `product-handler-${props.deployementEnv}`,
            runtime: lambda.Runtime.PYTHON_3_11,
            handler: 'main.handler', 
            architecture: lambda.Architecture.ARM_64,
            timeout: cdk.Duration.seconds(30),
            environment: {
                TABLE_NAME: database.table.tableName,
                DEPLOYMENT_ENV: props.deployementEnv
            },
            // NO BUNDLING HERE: GitHub Actions handles it!
            code: lambda.Code.fromAsset(entryPath),
        });

        const productIntegration = new HttpLambdaIntegration('ProductInt', this.handler);

        props.httpApi.addRoutes({
            path: '/{proxy+}', // Simplified proxy to let FastAPI handle routes
            methods: [apigwv2.HttpMethod.ANY],
            integration: productIntegration,
        });
 
        database.table.grantReadWriteData(this.handler);
    }
}

