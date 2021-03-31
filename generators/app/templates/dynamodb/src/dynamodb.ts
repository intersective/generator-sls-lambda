import AWS from 'aws-sdk';
// DynamoDB with lambda powertools
let DynamoDB = require('@dazn/lambda-powertools-dynamodb-client');

let options = {};

// connect to local DB if running offline
if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:1800',
  };
  // pure DynamoDB for local
  DynamoDB = new AWS.DynamoDB.DocumentClient(options);
}

const table = process.env.DYNAMODB_TABLE;

export function dbCreate(item: any) {
  const params = {
    TableName: table,
    Item: item,
  };
  return DynamoDB.put(params).promise();
}

export function dbDelete(id: string) {
  const params = {
    TableName: table,
    Key: {
      id,
    },
  };
  return DynamoDB.delete(params).promise();
}

export function dbGet(id: string): Promise<any> {
  const params = {
    TableName: table,
    Key: {
      id,
    },
  };
  return DynamoDB.get(params).promise().then((res: any) => res.Item);
}

export function dbUpdate(id: string, values: { key: string; value: any }[]) {
  const attributes: any = {};
  let expression = 'SET ';
  values.forEach((v, i) => {
    attributes[`:key${ i }`] = v.value;
    expression += i === 0 ? '' : ', ';
    expression += `${ v.key } = :key${ i }`;
  });
  const params = {
    TableName: table,
    Key: {
      id,
    },
    ExpressionAttributeValues: attributes,
    UpdateExpression: expression,
    ReturnValues: 'UPDATED_NEW',
  };
  return DynamoDB.update(params).promise();
}

export function dbScan() {
  const params = {
    TableName: table,
  };
  return DynamoDB.scan(params).promise().then((res: any) => res.Items);
}
