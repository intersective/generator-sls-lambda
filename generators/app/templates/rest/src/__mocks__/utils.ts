export const Log = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

<% if (useJwtParser) { %>
export const jwtDecode = jest.fn().mockReturnValue({});;
<% } %>
