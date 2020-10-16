import mongoose from 'mongoose';

const requiredString = { type: String, required: true };

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
