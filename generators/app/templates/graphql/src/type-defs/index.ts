import { gql } from 'apollo-server-lambda';

// Inputs

// Objects
import User from './objects/User';
// Root types
import Mutation from './root/Mutation'; // tslint:disable-line ordered-imports
import Query from './root/Query'; // tslint:disable-line ordered-imports

const typeDefStrings = [
  // Inputs

  // Objects
  User,
  // Root types
  Mutation,
  Query,
];

const typeDefs = typeDefStrings.map(typeDef => gql(typeDef));

export default typeDefs;
