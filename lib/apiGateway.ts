import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';

export class FastApiStack extends cdk.Stack {
  public readonly httpApi: apigwv2.HttpApi;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // This creates the base API Gateway
    this.httpApi = new apigwv2.HttpApi(this, 'MyHttpApi', {
      apiName: 'FastApServiceApi',
      // Optional: Add global CORS configuration here
      corsPreflight: {
        allowMethods: [apigwv2.CorsHttpMethod.ANY],
        allowOrigins: ['*'],
      },
    });

    // Output the URL after deployment
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: this.httpApi.apiEndpoint,
    });
  }
}
