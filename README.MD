# sls-lambda
This is a scaffolding tool that you can use to quickly create a new project with serverless, lambda function and TypeScript.

## How to use

### Installation
1. run `npm install -g yo` to install [yeoman](https://yeoman.io/)
1. run `npm install -g sls-lambda` to install sls-lambda
1. run `yo sls-lambda newapp` to create a new project under folder `newapp`
1. follow the instructions and choose the package that you need

### Run serverless
1. go to the new folder that you've just created `cd newapp`
1. run `npm run dev` to start the serverless server
1. send a GET request to `http://127.0.0.1:3000/dashboard` to test the server

## Packages

### Base packages
- express
- cors
- dotenv
- serverless
- serverless-http
- serverless-offline
- serverless-plugin-typescript
- serverless-certificate-creator
- serverless-domain-manager
- @dazn/lambda-powertools-logger
- @dazn/lambda-powertools-pattern-basic
- @dazn/lambda-powertools-http-client
- @types/cors
- @types/express
- typescript
- eslint
- @typescript-eslint/parser
- @typescript-eslint/eslint-plugin
- @typescript-eslint/eslint-plugin-tslint
- jest
- jest-express
- ts-jest

### jwt parser packages
- @practera/jwt-parser

### DynamoDB packages
- @dazn/lambda-powertools-dynamodb-client
- serverless-dynamodb-local
- aws-sdk

### SonarCloud packages
- jest-sonar-reporter
