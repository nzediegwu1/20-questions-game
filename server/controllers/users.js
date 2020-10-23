import bcrypt from 'bcrypt';
import { OnlineUsers, Users } from '../models';
import { response, resolver, CustomError, existsOr404 } from '../helpers/http';
import { authErrors, userErrors, userSuccess } from '../messages';
import { generateToken } from '../helpers/auth';
import { refreshOnlineUsers } from '../helpers/utils';
import { io } from '../app';

const UserController = {
  /**
   * @description Handles user signup
   *
   */
  async signup(req, res) {
    const {
      body: { email: mail, password },
    } = req;
    const email = mail.toLowerCase();
    const userExists = await Users.findOne({ email });
    if (userExists) throw new CustomError(userErrors.alreadyExists, 400);

    const newUser = await Users.create({
      ...req.body,
      email,
      isLogin: true,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
    });

    delete newUser._doc.password;
    return response({
      res,
      message: userSuccess.signup,
      data: { user: newUser, token: generateToken(newUser._doc) },
    });
  },

  /**
   * @description Handles user login
   */
  async login(req, res) {
    const {
      body: { email, password },
    } = req;
    const user = await Users.findOne({ email: email.toLowerCase() });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new CustomError(userErrors.invalidUser, 400);
    }
    if (user.isLogin) throw new CustomError(authErrors.alreadyLoggedIn, 401);

    delete user._doc.password;
    return response({
      res,
      message: userSuccess.login,
      data: { token: generateToken(user._doc), user },
    });
  },
  /**
   * @description Fetches details of the current user
   */
  async currentUser(req, res) {
    const { _id: userId } = req.user;
    const data = await Users.findById(userId).select('-password -__v');
    existsOr404(data, userErrors.notFound);
    return response({ res, message: userSuccess.retrieved, data });
  },

  /**
   * @description Handles edge cases upon user logout
   *
   */
  async onLogout(user) {
    Users.findOneAndUpdate({ _id: user._id }, { isLogin: false }).exec();
    await OnlineUsers.deleteMany({ user: user._id });
    io.emit('playerLeft', user);
    if (user.status !== 'playing') return refreshOnlineUsers();

    OnlineUsers.updateMany(
      { user: user.playingWith },
      { status: 'online' }
    ).exec(() => refreshOnlineUsers());
    const peer = await OnlineUsers.find({ user: user.playingWith });
    return peer.forEach(({ socketId }) => {
      io.to(socketId).emit('receiverAccepted', false);
    });
  },
  async onLoginSignup(user, socketId) {
    Users.updateOne({ _id: user }, { isLogin: true }).exec(() =>
      OnlineUsers.create({ user, socketId }).then(() => refreshOnlineUsers())
    );
  },
};

export default resolver(UserController);
