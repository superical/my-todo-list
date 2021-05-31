import { ITaskRepository } from '../repositories/Task.repository';
import { IUserRepository } from '../repositories/User.repository';

export class UserService {

  public constructor(
    private userRepository: IUserRepository
  ) {

  }

  public getUser(id: string) {
    const user = this.userRepository.getById(id);
    return user;
  }
}
