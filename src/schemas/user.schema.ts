import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface CardInterface {
  _id?: string;
  weight: string;
  type: string;
}

@Schema()
class Card extends Document {
  @Prop({ type: String })
  weight: string;

  @Prop({ type: String })
  type: string;
}
const CardSchema = SchemaFactory.createForClass(Card);

@Schema()
export class User extends Document {
  @Prop({ type: String, required: true, length: 50 })
  name: string;

  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Prop({ required: true, length: 50 })
  pwd: string;

  @Prop({ type: Number, default: 1500 })
  means: number;

  @Prop({ type: [CardSchema] })
  deck: CardInterface[];

  @Prop({ type: [CardSchema] })
  playerCards: CardInterface[];

  @Prop({ type: Number, default: 0 })
  playerPoints: number;

  @Prop({ type: Number, default: 0 })
  playerBet: number;

  @Prop({ type: [CardSchema] })
  dealerCards: CardInterface[];

  @Prop({ type: Number, default: 0 })
  dealerPoints: number;

  @Prop({ type: Boolean, default: false })
  isDeal: boolean;

  @Prop({ type: Boolean, default: false })
  isBet: boolean;

  @Prop({ type: Number, default: 0 })
  gameResult: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
