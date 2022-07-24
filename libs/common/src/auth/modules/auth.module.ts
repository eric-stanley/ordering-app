import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { RmqModule } from '../../rmq/modules/rmq.module';
import { AUHT_SERVICE } from '../constants/services';

@Module({
  imports: [
    RmqModule.register({
      name: AUHT_SERVICE,
    }),
  ],
  exports: [RmqModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
