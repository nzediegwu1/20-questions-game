require('dotenv').config();

export default {
  JWT_SECRET: process.env.JWT_SECRET,
  MONGODB_URL: process.env.MONGODB_URL,
  PORT: process.env.PORT || 8000,
};
