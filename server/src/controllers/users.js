import bcrypt from 'bcrypt';
import User from '../models/user';
import { existsOr404, response, resolver } from '../helpers/http';
import { userErrors, userSuccess } from '../messages';
import { generateToken } from '../helpers/auth';

const UserController = {
  async signup(req, res) {
    const {
      body: { email: mail, password },
    } = req;
    const email = mail.toLowerCase();
    const userExists = await User.findOne({ email });
    existsOr404(!userExists, userErrors.alreadyExists);

    const newUser = await User.create({
      ...req.body,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
    });
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
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res
        .status(400)
        .json({ errors: [userErrors.invalidUser] });
    }
    delete user._doc.password;
    return response({
      res,
      message: userSuccess.login,
      data: { token: generateToken(user._doc), user },
    });
  },
};

export default resolver(UserController);
