import { Test, TestingModule } from '@nestjs/testing';
import { BillingController } from './billing.controller';
import { BillingService } from '../services/billing.service';

describe('BillingController', () => {
  let billingController: BillingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BillingController],
      providers: [BillingService],
    }).compile();

    billingController = app.get<BillingController>(BillingController);
  });
});
