import express from 'express';
import users from './controllers/users';
import { validateLogin, validateSignup, validateID, handleValidation } from './middlewares/validator';

const app = express.Router();

app.get('/', (_, res) => res.status(200).send('Welcome 20 words game api'));

app.post('/signup', validateSignup, handleValidation, users.signup);
app.post('/login', validateLogin, handleValidation, users.login);
app.get('/users/:id', validateID, handleValidation, users.getOne);

export default app;
