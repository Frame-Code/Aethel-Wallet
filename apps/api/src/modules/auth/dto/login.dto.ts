import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  idToken: string; // Firebase idToken — el frontend lo genera tras autenticarse
}