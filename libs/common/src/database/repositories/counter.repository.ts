import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CounterDocument } from '../schemas/counter.schema';
import { AbstractRepository } from './abstract.repository';

@Injectable()
export class CounterRepository extends AbstractRepository<CounterDocument> {
  protected readonly logger = new Logger(CounterRepository.name);

  constructor(
    @InjectModel(CounterDocument.name) counterModel: Model<CounterDocument>,
    @InjectConnection() connection: Connection,
  ) {
    console.log('in counter repo');
    super(counterModel, connection);
  }
}
