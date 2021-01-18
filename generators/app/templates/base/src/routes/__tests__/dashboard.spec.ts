import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';
import dashboard from '../dashboard';
jest.mock('../../utils');

let mockRequest: any;
let mockResponse: any;

beforeEach(() => {
  mockRequest = new Request();
  mockResponse = new Response();
});

afterEach(async () => {
  await dashboard(mockRequest, mockResponse);
  expect(mockResponse).toMatchSnapshot();
});

it('1. should return success', () => {

});

