import mongoose from 'mongoose';

const requiredString = { type: String, required: true };

const User = new mongoose.Schema(
  {
    email: { ...requiredString, unique: true },
    fullname: requiredString,
    password: requiredString,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('User', User);
