import { createTestClient } from 'apollo-server-testing';
import { constructTestServer } from '../../testing';
import gql from 'graphql-tag';
import { mocked } from 'ts-jest/utils';

let testQuery = gql`
  query getUsers {
    users {
      uuid
      name
    }
  }
`;
let variables = null;
let context;
let mockedUsers;

beforeEach(() => {
  // initialise mocked data
  mockedUsers = [
    {
      uuid: 'user-1',
      name: 'user 1',
    },
    {
      uuid: 'user-2',
      name: 'user 2',
    },
  ];
});

afterEach(async () => {
  // construct test server
  const { server, http } = constructTestServer(context);
  http.getUsers = jest.fn().mockReturnValue(mockedUsers);
  // start testing
  const graphql = createTestClient(server);
  const res = await graphql.query({ query: testQuery, variables });
  expect(res).toMatchSnapshot();
});

it('1. should get correct users', () => {

});

