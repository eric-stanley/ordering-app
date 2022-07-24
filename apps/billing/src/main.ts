import { NestFactory } from '@nestjs/core';
import { RmqService } from '@app/common';
import { BillingModule } from './modules/billing.module';

async function bootstrap() {
  const app = await NestFactory.create(BillingModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('BILLING'));
  await app.startAllMicroservices();
}
bootstrap();
