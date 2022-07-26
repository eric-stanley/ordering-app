import { Logger, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { CounterRepository } from '../repositories/counter.repository';
import { AbstractDocument } from '../schemas/abstract.schema';

export abstract class AutoSequencer<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(
    protected readonly model: Model<TDocument>,
    private readonly coutnerRepository: CounterRepository,
  ) {}

  async autoSequenceModelID(
    modelName: string,
    doc: any,
    idFieldName: string,
    seq: number,
    next: (arg0?: any) => any,
  ) {
    const counter = await this.coutnerRepository.findOneAndUpdate(
      { collection_id: modelName },
      { $inc: { seq } },
    );

    if (!counter) {
      this.logger.warn(`No counter found with that name ${modelName}`, {
        collection_id: modelName,
      });
      return next(
        new NotFoundException(`No counter found with that name ${modelName}`),
      );
    }

    doc[idFieldName] = counter.seq;
    if (seq === 1) next();
  }
}
