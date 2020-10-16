import jwt from 'jsonwebtoken';
import config from '../config';

const { JWT_SECRET } = config;

export const generateToken = payload =>
  jwt.sign({ ...payload }, JWT_SECRET, { expiresIn: '9999 years' });
