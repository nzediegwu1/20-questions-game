/* eslint-disable no-underscore-dangle */
import jwt from 'jsonwebtoken';
import { Users } from '../models';
import config from '../config';
import { authErrors } from '../messages';
import { response } from '../helpers/http';

const { JWT_SECRET } = config;

export default (req, res, next) => {
  const { authorization } = req.headers;
  const token =
    req.headers.token || req.query.token || authorization?.slice(7);

  if (!token) return response({ res, code: 403, errors: [authErrors.unauthorized] });
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) return response({ res, code: 403, errors: [authErrors.sessionExpired] });

    const user = await Users.findOne({ _id: decoded._id });
    if (!user) return response({ res, code: 403, errors: [authErrors.invalidAuth] });

    req.user = user;
    return next();
  });
};
