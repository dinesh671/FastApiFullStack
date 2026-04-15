import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam'
import * as path from 'path';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { userDatabase } from './userDb';

interface UserServiceProps extends cdk.StackProps {
    httpApi: apigwv2.HttpApi;
    deployementEnv: 'dev' | 'prod';
    databaseUrl?: string;
}



export class UserService extends cdk.Stack {
    public readonly handler: lambda.Function;

    constructor(scope: Construct, id: string, props: UserServiceProps) {
        super(scope, id, props);

        const role = new iam.Role(this, 'userHandlerServiceRole', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            roleName: cdk.PhysicalName.GENERATE_IF_NEEDED,
        });

        role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'));

        const database = new userDatabase(this, 'UserDatabase');

        // Point to the folder where GitHub Actions will install the libraries
        const entryPath = path.join(process.cwd(), 'src', 'backend', 'user');

        this.handler = new lambda.Function(this, 'User-handler', {
            functionName: `user-handler-${props.deployementEnv}`,
            runtime: lambda.Runtime.PYTHON_3_11,
            handler: 'main.handler',
            architecture: lambda.Architecture.X86_64,
            timeout: cdk.Duration.seconds(30),
            environment: {
                TABLE_NAME: database.table.tableName,
                DEPLOYMENT_ENV: props.deployementEnv
            },
            // NO BUNDLING HERE: GitHub Actions handles it!
            code: lambda.Code.fromAsset(entryPath),
            // roleName: cdk.PhysicalName.GENERATE_IF_NEEDED,
            role: role
        });

        const userIntegration = new HttpLambdaIntegration('UserInt', this.handler);

        props.httpApi.addRoutes({
            path: '/users/{proxy+}', // Simplified proxy to let FastAPI handle routes
            methods: [apigwv2.HttpMethod.ANY],
            integration: userIntegration,
        });

        database.table.grantReadWriteData(this.handler);
    }
}

