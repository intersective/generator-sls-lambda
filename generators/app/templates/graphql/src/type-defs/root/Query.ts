export default `
  type Query {

    "Get a list of users"
    users(

      "If passed in, will filter the user name by it"
      filter: String

    ): [User]

  }
`;
