import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.model';

export type DemandeDocument = Demande & Document;

@Schema({ timestamps: true })
export class Demande {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true, default: "En attente" })
  status: string;

  @Prop()
  documents: string[];

  @Prop()
  num_matricule: string;

  @Prop()
  puissance: string;

  @Prop()
  num_chassie: string;

  @Prop()
  mark: string;

  @Prop()
  model: string;

  @Prop()
  nb_place: string;

  @Prop()
  carburant: string;

  @Prop()
  year: string;

  @Prop()
  valeur: string;

  @Prop()
  adresse: string;

  @Prop()
  maison: string;

  @Prop()
  nb_piece: string;

  @Prop()
  superficie: string;
  @Prop()
  type: string;
}

export const DemandeSchema = SchemaFactory.createForClass(Demande);
