import { User } from '../models/User';
import { Database } from '../db';

export interface IUserRepository {
  getById(id: string): User | undefined
}

export class UserRepository implements IUserRepository {

  public constructor(private db: Database) {
  }

  getById(id: string): User | undefined {
    // TODO: Implement method
    return undefined;
  }
}
