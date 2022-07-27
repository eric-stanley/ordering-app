import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from '@app/common';
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
