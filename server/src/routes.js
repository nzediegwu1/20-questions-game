import express from 'express';
import { User, Game } from './controllers';
import {
  validateLogin,
  validateSignup,
  handleValidation,
} from './middlewares/validator';
import loginRequired from './middlewares/loginRequired';

const app = express.Router();

app.get('/', (_, res) => res.status(200).send('Welcome 20 words game api'));

app.post('/signup', validateSignup, handleValidation, User.signup);
app.post('/login', validateLogin, handleValidation, User.login);
app.get('/currentUser', loginRequired, User.currentUser);
app.post('/acceptInvite', loginRequired, Game.acceptInvite);

export default app;
