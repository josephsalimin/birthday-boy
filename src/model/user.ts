import * as mongoose from 'mongoose';

export interface UserDocument extends mongoose.Document {
  facebookId: string;
  name: string;
  birthday: string;
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
    type: String
  }
});

export const User = mongoose.model<UserDocument>('User', schema);