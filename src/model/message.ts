import * as mongoose from 'mongoose';

export interface MessageDocument extends mongoose.Document {
  facebookId: string;
  name: string;
  birthday: string;
  createdAt: number;
}

const schema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  input: {
    type: String,
    required: true
  },
  output: {
    type: String,
    required: true
  },
  createdAt: { 
    type: Number, 
    required: true
  },
  __v: { 
    type: Number,
    select: false
  }
});

export const Message = mongoose.model<MessageDocument>('message', schema);