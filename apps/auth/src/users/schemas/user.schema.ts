import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';
import { IsEmail } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Schema({
  versionKey: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class User extends AbstractDocument {
  @Prop({
    unique: true,
  })
  user_id: number;

  @Prop({
    unique: true,
    required: [true, 'A user must have a username'],
    trim: true,
    maxlength: [25, 'Username must have less than or equal to 25 characters'],
    minlength: [5, 'Username must have more than or equal to 6 characters'],
    lower: true,
  })
  username: string;

  @Prop({
    select: false,
    required: [true, 'A user must have a password'],
    maxlength: [40, 'Password must have less than or equal to 40 characters'],
    minlength: [8, 'Password must have more than or equal to 8 characters'],
  })
  password: string;

  @Prop({
    required: [true, 'Please confirm your password'],
    validate: {
      // Only works on create and save
      validator: async function (el: any) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  })
  password_confirm: string;

  @Prop({
    required: [true, 'A user must have an email'],
    unique: true,
    trim: true,
    validate: [IsEmail, 'Please enter a valid email'],
    lowercase: true,
  })
  email: string;

  @Prop({
    default: true,
    select: false,
  })
  is_active: boolean;

  @Prop()
  password_changed_at: Date;

  @Prop()
  password_reset_token: string;

  @Prop()
  password_reset_expires: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({
  user_id: 1,
});

UserSchema.index({
  username: 1,
});

UserSchema.index({
  email: 1,
});

UserSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.password_confirm = undefined;
  next();
});

UserSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.password_changed_at = new Date(Date.now() - 1000);
  next();
});

UserSchema.pre('save', async function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.isPasswordChanged = function (JWTTimestamp: number) {
  if (this.password_changed_at) {
    const changedTime: string = (
      this.password_changed_at.getTime() / 1000
    ).toString();
    const changedTimestamp = parseInt(changedTime, 10);
    return JWTTimestamp < changedTimestamp;
  }

  // False means not changed
  return false;
};

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.password_reset_token = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.password_reset_expires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

UserSchema.plugin((schema: any) => {
  schema.options.toJSON = {
    virtuals: true,
    versionKey: false,
    transform(
      _doc: any,
      ret: {
        _id: any;
        id: any;
        password: string;
        password_confirm: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
      },
    ) {
      delete ret._id;
      delete ret.id;
      delete ret.password;
      delete ret.password_confirm;
      delete ret.is_active;
      delete ret.created_at;
      delete ret.updated_at;
    },
  };
});
