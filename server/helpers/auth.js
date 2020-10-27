import jwt from 'jsonwebtoken';
import config from '../config';

const { JWT_SECRET } = config;

/**
 * @description Generates a JWT token
 * @param {Object} payload User data to encode within JWT token
 */
export const generateToken = (payload) =>
  jwt.sign({ ...payload }, JWT_SECRET, { expiresIn: '9999 years' });
