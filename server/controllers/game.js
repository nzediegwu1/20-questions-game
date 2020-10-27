import { io } from '../app';
import { resolver, response } from '../helpers/http';
import { refreshOnlineUsers } from '../helpers/utils';
import { gameSuccess } from '../messages/success';
import { OnlineUsers } from '../models';

const GameController = {

  /**
   * @description Enables a user to accept game invite and handles edge cases associated
   * @param {Object} req HTTP request object
   * @param {Object} res HTTP response object
   * @returns {Object} JSON response
   */
  async acceptInvite(req, res) {
    const {
      user: { _id: invitee },
      body: { sender },
    } = req;
    const senderSockets = await OnlineUsers.find({ user: sender });
    senderSockets.forEach((item) => {
      io.to(item.socketId).emit('receiverAccepted', true);
    });
    await Promise.all([
      OnlineUsers.updateMany(
        { user: invitee },
        { status: 'playing', playingWith: sender }
      ).exec(),
      OnlineUsers.updateMany(
        { user: sender },
        { status: 'playing', playingWith: invitee }
      ).exec(),
    ]);
    refreshOnlineUsers();
    return response({ res, message: gameSuccess.acceptInvite });
  },
};

export default resolver(GameController);
