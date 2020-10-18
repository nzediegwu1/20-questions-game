import { Schema, model } from 'mongoose';
import { requiredString } from '../helpers/utils';

const OnlineUser = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      ...requiredString,
      enum: ['online', 'invited', 'playing'],
      default: 'online',
    },
    socketId: requiredString,
    playingWith: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

export default model('OnlineUser', OnlineUser);
