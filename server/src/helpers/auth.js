import jwt from 'jsonwebtoken';
import config from '../config';

const { JWT_SECRET } = config;

export const generateToken = (payload, duration = undefined) =>
  jwt.sign({ ...payload }, JWT_SECRET, { expiresIn: duration || '7d' });
