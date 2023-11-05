import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /**
   * dtoを使うにはValidationPipeの記述が必要になる
   * whitelist:trueにするとdtoに含まれないフィールドを省いてくれる
   */
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000'],
  });
  app.use(cookieParser());
  app.use(
    csurf({
      //cookieの設定
      cookie: {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      },
      //ユーザーのリクエストからトークンを取り出す
      value: (req: Request) => {
        return req.header('csrf-token');
      },
    }),
  );
  await app.listen(process.env.PORT || 3005); //本番に乗せた時はPORTを使用、なければ3005
}
bootstrap();
