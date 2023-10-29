import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      //cookieからjwtを取り出す処理
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let jwt = null;
          //クライアントからのリクエストかつその中にcookieが含まれている場合
          if (req && req.cookies) {
            jwt = req.cookies['access_token'];
          }
          return jwt;
        },
      ]),
      ignoreExpiration: false, //trueにするとjwtの有効期限が切れていても、有効なjwtと判定されてしまう
      secretOrKey: config.get('JWT_SECRET'), //jwt生成に使ったキーをここで指定する
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub, //subにはuserIdが格納されている（AuthService.generateJwtで定義）
      },
    });

    delete user.hashedPassword;
    return user;
    //jwtを解析しているのでログインしているユーザーのオブジェクトを返す
    //Nest.jsではこのユーザーのオブジェクトを自動的にリクエストに含めてくれる機能がある
    //UserControllerはRequestにアクセスできるため、そこからログインしているユーザーのオブジェクトを取り出すことができる
  }
}
