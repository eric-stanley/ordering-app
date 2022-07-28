import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Counter } from '../schemas/counter.schema';
import { AbstractRepository } from './abstract.repository';

@Injectable()
export class CounterRepository extends AbstractRepository<Counter> {
  protected readonly logger = new Logger(CounterRepository.name);

  constructor(
    @InjectModel(Counter.name) counterModel: Model<Counter>,
    @InjectConnection() connection: Connection,
  ) {
    super(counterModel, connection);
  }
}
