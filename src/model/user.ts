import * as mongoose from 'mongoose';

export interface UserDocument extends mongoose.Document {
  facebookId: string;
  name: string;
  birthday: Date;
}

const schema = new mongoose.Schema({
  facebookId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String
  },
  birthday: {
    type: Date
  }
});

export const User = mongoose.model<UserDocument>('User', schema);