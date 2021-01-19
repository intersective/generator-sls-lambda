import { User } from '../../types';

function users(_: any, args: { filter: string }, context: any): Promise<User> {
  return context.dataSources.http.getUsers();
}

export default users;
