import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

@Schema({ versionKey: false })
export class User extends AbstractDocument {
  @Prop()
  email: string;

  @Prop({
    select: false,
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
