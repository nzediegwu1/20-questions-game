import bcrypt from 'bcrypt';

import { io } from '../app';
import { userErrors } from '../messages';
import { OnlineUsers, Users } from '../models';
import { CustomError } from './http';

/**
 * @description Fetches a unique list of online users, with user details
 */
export const refreshOnlineUsers = async () => {
  const onlineUsers = await OnlineUsers.aggregate([
    {
      $group: {
        _id: '$user',
        status: { $first: '$status' },
        playingWith: { $first: '$playingWith' },
        socketId: { $first: '$socketId' },
        updatedAt: { $last: '$updatedAt' },
      },
    },
    { $sort: { updatedAt: -1 } },
    {
      $lookup: {
        from: 'users',
        let: { user: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$_id', '$$user'] } } },
          { $project: { _id: 0, nickname: 1, email: 1 } },
        ],
        as: 'user',
      },
    },
    { $unwind: '$user' },
  ]);
  return io.emit('onlineUsers', onlineUsers);
};

/**
 * @description Generates a cookie Object from cookie string retrieved from socket
 *
 * @param {Object} socket Socket instance
 * @returns {Object} Key value pair of the items within cookie
 */
export const generateCookies = (socket) => {
  const { cookie } = socket.request.headers;
  const cookieArray = cookie?.split(/=|;\s+/g) || [];
  return cookieArray.reduce((result, current, index) => {
    if (index % 2 === 0) result[current] = cookieArray[index + 1];
    return result;
  }, {});
};

export const requiredString = { type: String, required: true };

export const validateUser = async (reqBody) => {
  const { email, password } = reqBody;

  const user = await Users.findOne({ email: email.toLowerCase() });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new CustomError(userErrors.invalidUser, 400);
  }
  return user;
};
