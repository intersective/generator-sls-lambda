[![npm version](https://badge.fury.io/js/generator-sls-lambda.svg)](https://badge.fury.io/js/generator-sls-lambda)

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

## Tools & Packages

- ExpressJS
  - express
  - cors
  - dotenv
- Serverless Framework
  - serverless
  - serverless-http
  - serverless-offline
  - serverless-plugin-typescript
  - serverless-certificate-creator
  - serverless-domain-manager
- [DAZN Lambda Powertools](https://github.com/getndazn/dazn-lambda-powertools)(Logging System)
  - @dazn/lambda-powertools-logger
  - @dazn/lambda-powertools-pattern-basic
  - @dazn/lambda-powertools-http-client
- TypeScript
  - @types/cors
  - @types/express
  - typescript
  - eslint
  - @typescript-eslint/parser
  - @typescript-eslint/eslint-plugin
  - @typescript-eslint/eslint-plugin-tslint
- [Jest](https://jestjs.io/en)
  - jest
  - jest-express
  - ts-jest
- GitHub Action Flows
- [Jwt Parser](https://github.com/intersective/jwt-parser)
  - @practera/jwt-parser
- DynamoDB
  - @dazn/lambda-powertools-dynamodb-client
  - serverless-dynamodb-local
  - aws-sdk
- SonarCloud
  - jest-sonar-reporter
- GraphQL
  - apollo-datasource
  - apollo-datasource-rest
  - apollo-server-lambda
  - dataloader
  - graphql
  - graphql-tag
  - @2fd/graphdoc
  - @types/aws-lambda
  - apollo-server-testing
