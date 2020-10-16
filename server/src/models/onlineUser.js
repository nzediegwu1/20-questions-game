import { Schema, model } from 'mongoose';

const OnlineUser = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model('OnlineUser', OnlineUser);
