import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  uid: string; 

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  username: string;
}