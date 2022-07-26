import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from '@app/common';
import { Counter } from '../schemas/counter.schema';

@Injectable()
export class CounterRepository extends AbstractRepository<Counter> {
  protected readonly logger = new Logger(CounterRepository.name);

  constructor(
    @InjectModel(Counter.name) userModel: Model<Counter>,
    @InjectConnection() connection: Connection,
  ) {
    super(userModel, connection);
  }
}
