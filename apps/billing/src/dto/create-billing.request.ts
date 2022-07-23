import {
  IsString,
  IsNotEmpty,
  IsPositive,
  IsPhoneNumber,
} from 'class-validator';

export class CreateBillingRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPositive()
  price: number;

  @IsPhoneNumber()
  phoneNumber: string;
}
