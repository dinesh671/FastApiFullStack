#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { ProductService } from '../lib/constructs/product-service';
import { FastApiStack } from '../lib/apiGateway';
import { ProductDatabase } from '../lib/constructs/database';

const app = new cdk.App();
// new PythonFastapiStack(app, 'PythonFastapiStack', {
//   /* If you don't specify 'env', this stack will be environment-agnostic.
//    * Account/Region-dependent features and context lookups will not work,
//    * but a single synthesized template can be deployed anywhere. */

//   /* Uncomment the next line to specialize this stack for the AWS Account
//    * and Region that are implied by the current CLI configuration. */
//   env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

//   /* Uncomment the next line if you know exactly what Account and Region you
//    * want to deploy the stack to. */
//   // env: { account: '123456789012', region: 'us-east-1' },

//   /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
// });

// const myStack = new cdk.Stack(app, 'ProductService');

const env = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
}


const gatewayStack = new FastApiStack(app, 'ApiGatewayStack',{env:env});

new ProductService(app, 'productsMicroService', {
    httpApi: gatewayStack.httpApi,
    deployementEnv: 'dev',
    env: env
})

