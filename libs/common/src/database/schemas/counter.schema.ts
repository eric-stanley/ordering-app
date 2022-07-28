import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from './abstract.schema';

export class Counter extends AbstractDocument {
  @Prop({
    required: true,
  })
  collection_id: string;

  @Prop({
    default: 0,
  })
  seq: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);

CounterSchema.index({ collection_id: 1, seq: 1 }, { unique: true });
