import { Logger, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { AbstractDocument } from '../schemas/abstract.schema';

export abstract class AutoSequencer<TDocument extends AbstractDocument> {
  protected readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async autoSequenceModelID(
    modelName: string,
    doc: any,
    idFieldName: string,
    seq: number,
    next: (arg0?: any) => any,
  ) {
    console.log('inside auto sequencer');
    const counter = await this.model.findOneAndUpdate(
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

    doc[idFieldName] = seq;
    if (seq === 1) next();
  }
}
