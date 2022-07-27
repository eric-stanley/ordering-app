import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { CreateUserRequest } from '../dto/create-user.request';
import { ServerErrorExceptionsFilter } from '../exceptions/server-exception.filter';
import { UsersService } from '../services/users.service';

@Controller('auth/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseFilters(ServerErrorExceptionsFilter)
  async createUser(@Body() request: CreateUserRequest) {
    return this.usersService.createUser(request);
  }
}
