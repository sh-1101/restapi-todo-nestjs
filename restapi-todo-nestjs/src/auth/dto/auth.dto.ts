import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;
}

/**
 * DTO(データトランスファーオブジェクト)
 *
 * クライアントからサーバーに送られてくるデータのことを意味する
 * ログインの場合だとユーザーが入力するemailやpasswordなど
 */
