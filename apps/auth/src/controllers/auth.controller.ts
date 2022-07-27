import { Controller, Post, Res, UseFilters, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import JwtAuthGuard from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { User } from '../users/schemas/user.schema';
import { HttpExceptionFilter } from '../exceptions/http-exception.filter';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @UseFilters(HttpExceptionFilter)
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    response.send(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  @UseFilters(HttpExceptionFilter)
  async logout(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(response);
    response.send(user);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('validate_user')
  async validateUser(@CurrentUser() user: User) {
    return user;
  }
}
