import mongoose from 'mongoose';
import { requiredString } from '../helpers/utils';


const User = new mongoose.Schema(
  {
    email: { ...requiredString, unique: true },
    nickname: requiredString,
    password: requiredString,
    isLogin: Boolean,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('User', User);
