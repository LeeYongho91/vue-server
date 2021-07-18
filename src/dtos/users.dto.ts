import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public nickname: string;

  @IsString()
  public password: string;
}

export class LoginUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}