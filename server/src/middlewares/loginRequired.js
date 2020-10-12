/* eslint-disable no-underscore-dangle */
import jwt from 'jsonwebtoken';
import User from '../models/user';
import config from '../config';
import { authErrors } from '../messages';

const { JWT_SECRET } = config;

export default (req, res, next) => {
  const { authorization } = req.headers;
  const token =
    req.headers.token || req.query.token || authorization?.slice(7);

  if (!token) {
    return res.status(403).json({ errors: [authErrors.unauthorized] });
  }
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ errors: [authErrors.sessionExpired] });
    }
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      return res.status(403).json({ errors: [authErrors.invalidAuth] });
    }
    req.user = user;
    return next();
  });
};
