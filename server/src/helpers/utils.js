import { io } from '../app';
import { OnlineUsers } from '../models';

export const refreshOnlineUsers = async () => io.emit(
  'onlineUsers',
  await OnlineUsers.find({}).sort('-updatedAt').populate({
    path: 'user',
    select: 'nickname email',
  }),
);


export const generateCookies = (socket) => {
  const { cookie } = socket.request.headers;
  const cookieArray = cookie.split(/=|;\s+/g);
  return cookieArray.reduce((result, current, index) => {
    if (index % 2 === 0) result[current] = cookieArray[index + 1];
    return result;
  }, {});
};
