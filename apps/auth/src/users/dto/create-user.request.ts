import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsEqualTo } from '../../decorators/match.decorator';

export class CreateUserRequest {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(25)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(40)
  password: string;

  // @IsEqualTo('password')
  password_confirm: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
