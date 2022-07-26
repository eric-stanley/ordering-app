import { JwtAuthGuard, RmqService } from '@app/common';
import { Controller, UseGuards } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { BillingService } from '../services/billing.service';
import { CreateBillingRequest } from '../dto/create-billing.request';

@Controller()
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('order_created')
  @UseGuards(JwtAuthGuard)
  async handleOrderCreated(
    @Payload() data: CreateBillingRequest,
    @Ctx() context: RmqContext,
  ) {
    this.billingService.bill(data);
    this.rmqService.ack(context);
  }
}
