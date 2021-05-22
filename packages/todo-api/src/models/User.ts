import { v4 as uuid } from 'uuid';

export class User {

  public id: string;

  public constructor(
    public username: string,
    public passwordHash: string,
    public friends: User[]
  ) {
    this.id = uuid();
  }
}
