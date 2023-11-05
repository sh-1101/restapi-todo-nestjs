import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  Get,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Csrf, Msg } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() dto: AuthDto): Promise<Msg> {
    return this.authService.signUp(dto);
  }

  @Get('csrf')
  getCsrfToken(@Req() req: Request): Csrf {
    return { csrfToken: req.csrfToken() };
  }

  @HttpCode(HttpStatus.OK) //デフォルトだとステータスコード201(create)になるため200に変更
  @Post('login')
  async login(
    @Body() dto: AuthDto,

    /**
     * Express libraryのobject(@Res decoratorでinjection)を使用すると
     * standard(Nest.jsの機能でリターンのオブジェクトを自動でjson化してくれる機能)が無効化される。
     * passthrough: trueにするよ両方有効かできる
     * @Res Response only → Requestは無関係
     */
    @Res({ passthrough: true }) res: Response,
  ): Promise<Msg> {
    const jwt = await this.authService.login(dto);

    res.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      secure: true, //Secure:true → httpsで暗号化された通信のみcookie使用可能
      sameSite: 'none',
      path: '/',
    });

    return {
      message: 'ok',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Msg {
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });

    return {
      message: 'ok',
    };
  }
}
