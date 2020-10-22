import { io } from '../app';
import { OnlineUsers } from '../models';

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

export const generateCookies = (socket) => {
  const { cookie } = socket.request.headers;
  const cookieArray = cookie?.split(/=|;\s+/g) || [];
  return cookieArray.reduce((result, current, index) => {
    if (index % 2 === 0) result[current] = cookieArray[index + 1];
    return result;
  }, {});
};

export const requiredString = { type: String, required: true };
