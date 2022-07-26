import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserRequest } from '../dto/create-user.request';
import { User } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(request: CreateUserRequest) {
    await this.validateCreateUserRequest(request);
    const user = await this.usersRepository.create({
      ...request,
      password: await bcrypt.hash(request.password, 10),
      user_id: 0,
      slug: '',
      is_active: false,
      password_changed_at: undefined,
      password_reset_token: '',
      password_reset_expires: '',
    });
    return user;
  }

  private async validateCreateUserRequest(request: CreateUserRequest) {
    let user: User;
    try {
      user = await this.usersRepository.findOne({
        email: request.email,
      });
    } catch (err) {}

    if (user) {
      throw new UnprocessableEntityException('Email already exists.');
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne(
      { email },
      'email password',
    );
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    user.password = undefined;
    return user;
  }

  async getUser(getUserArgs: Partial<User>) {
    const user = await this.usersRepository.findOne(getUserArgs);
    return user;
  }
}
