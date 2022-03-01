import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Permission } from './permission.model';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ unique: true })
  email: string;
  
  @Prop({ unique: true })
  address: string;

  @Prop()
  password: string;

  @Prop()
  phone: string;

  @Prop({ required: true, default: 'client' })
  role: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }] })
  permissions: Permission[];

  @Prop()
  last_login: Date;

  @Prop({required: true, default: false})
  archived: boolean
}

export const UserSchema = SchemaFactory.createForClass(User);
