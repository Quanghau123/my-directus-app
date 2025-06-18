import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  full_name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  university!: string;
}
