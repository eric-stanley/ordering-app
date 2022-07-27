import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Counter } from '../schemas/counter.schema';
import { AutoSequencer } from '../utils/auto-sequencer';

@Injectable()
export class CounterRepository extends AutoSequencer<Counter> {
  protected readonly logger = new Logger(CounterRepository.name);

  constructor(@InjectModel(Counter.name) counterModel: Model<Counter>) {
    console.log('in counter repo');
    super(counterModel);
  }
}
