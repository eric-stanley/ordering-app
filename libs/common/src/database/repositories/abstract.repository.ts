import { Logger, NotFoundException } from '@nestjs/common';
import {
  FilterQuery,
  Model,
  Types,
  UpdateQuery,
  SaveOptions,
  Connection,
} from 'mongoose';
import { AbstractDocument } from '../schemas/abstract.schema';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(
    protected readonly model: Model<TDocument>,
    private readonly connection: Connection,
  ) {}

  async create(document: any, options?: SaveOptions): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (
      await createdDocument.save(options)
    ).toJSON() as unknown as TDocument;
  }

  async findOne(
    filterQuery: FilterQuery<TDocument>,
    options = {},
  ): Promise<TDocument> {
    const document: TDocument | PromiseLike<TDocument> = await this.model
      .findOne(
        filterQuery,
        {},
        {
          lean: true,
        },
      )
      .select(options);

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ) {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
    });

    if (!document) {
      this.logger.warn(`Document not found with filterQuery:`, filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async upsert(
    filterQuery: FilterQuery<TDocument>,
    document: Partial<TDocument>,
  ) {
    return this.model.findOneAndUpdate(filterQuery, document, {
      lean: true,
      upsert: true,
      new: true,
    });
  }

  async find(filterQuery: FilterQuery<TDocument>) {
    return this.model.find(filterQuery, {}, { lean: true });
  }

  async startTransaction() {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }

  async autoSequenceModelID(
    modelName: string,
    doc: Partial<TDocument>,
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
