# <%= appname %>

## Unit Test

- We use [Jest](https://jestjs.io/en), [Ts Jest](https://kulshekhar.github.io/ts-jest/) for the unit tests of this repo.
- To run unit test run: `npm run test`.
- Test coverage will be available at `coverage/index.html`.

References:
- https://github.com/jameswlane/jest-express

## Installation
1. `npm install`

## Local Development
1. Create `.env` file as below and modify or add parameters if needed
1. cp env.example .env
1. Run `npm run dev` to run a serverless server on local
1. A serverless offline server will be on `127.0.0.1:8000`

<% if (useDynamoDB) { %>
- Make sure we installed jdk as this is mandatory for local dynamoDB table to work
- Below command to execute for setup.
```
- Run `npm install` # To install all dependencies
- Run `npm run db_install`  # To install dynamoDB local
- Run `npm run dev`  # To run this setup locally for development and testing purpose.
- Run `npm run db_migrate` # To create local db table or migrate table. Note - Run in seperate terminal window after previous command.
```

## Detailed Information and Interactive Shell window terminal for dynamoDB for auto code generation as per api calls.

```
http://localhost:18000/shell

```
<% } %>

## Logging
- We use [DAZN Lambda Powertools](https://github.com/getndazn/dazn-lambda-powertools) as the error logging tool.
- Environment variable `LOG_LEVEL` has 4 values:
 - `DEBUG` - Display all logs
 - `INFO` - Display `Log.info()` logs and above
 - `WARN` - Display `Log.warn()` logs and above
 - `ERROR` - Display `Log.error()` only
- Environment variable `SAMPLE_DEBUG_LOG_RATE` controls the sampling rate of debug logs
 - By default it is 0.01, that means we will log debug logs for 1% of the requests
 - If we wanna enable debug logs for all services that is related to the current service, we can change it to 1. **Note: Remember to change it back to 0.01 after debugging, as this will increase the AWS cost**
