import bcrypt from 'bcrypt';
import { OnlineUsers, Users } from '../models';
import { response, resolver, CustomError } from '../helpers/http';
import { authErrors, userErrors, userSuccess } from '../messages';
import { generateToken } from '../helpers/auth';
import { refreshOnlineUsers } from '../helpers/utils';

const UserController = {
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
    await OnlineUsers.create({ user: newUser._id });
    refreshOnlineUsers();

    delete newUser._doc.password;
    return response({
      res,
      message: userSuccess.signup,
      data: { user: newUser, token: generateToken(newUser._doc) },
    });
  },

  async login(req, res) {
    const {
      body: { email, password },
    } = req;
    const user = await Users.findOne({ email: email.toLowerCase() });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new CustomError(userErrors.invalidUser, 400);
    }
    if (user.isLogin) throw new CustomError(authErrors.alreadyLoggedIn, 401);

    const query = { user: user._id };
    Users.updateOne({ _id: user._id }, { isLogin: true }).exec();
    await OnlineUsers.create(query);
    refreshOnlineUsers();

    delete user._doc.password;
    return response({
      res,
      message: userSuccess.login,
      data: { token: generateToken(user._doc), user },
    });
  },
  async logout(user) {
    Users.findOneAndUpdate({ _id: user }, { isLogin: false }).exec();
    await OnlineUsers.deleteOne({ user });
    refreshOnlineUsers();
  },
};

export default resolver(UserController);
