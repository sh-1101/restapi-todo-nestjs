import { Injectable } from '@nestjs/common';

@Injectable() //Injectable()デコレータをつけることでAppServiceをコントローラーや他のサービスに注入できる
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
