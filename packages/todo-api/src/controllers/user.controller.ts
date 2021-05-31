import { IUserRepository } from '../repositories/User.repository';
import { UserService } from '../services/User.service';

export class UserController {

  public constructor(
    private userService: UserService
  ) {

  }



}
