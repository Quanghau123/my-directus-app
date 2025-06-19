import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  student_id!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  university_name!: string;

  @IsString()
  @IsNotEmpty()
  university_code!: string;

  @IsOptional()
  @IsString()
  referrer?: string;
}
