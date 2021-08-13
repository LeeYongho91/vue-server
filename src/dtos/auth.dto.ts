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

export class EmailDoubleCheckDto {
  @IsEmail()
  public email: string;
}

export class nicknameDoubleCheckDto {
  @IsString()
  public nickname: string;
}

export class accountUpdateDto {
  @IsString()
  public uuid: string;

  @IsString()
  public nickname: string;

  @IsString()
  public password: string;
}

export class userWithdrawDto {
  @IsString()
  public uuid: string;
}
