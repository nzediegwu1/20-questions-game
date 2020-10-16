/* eslint-disable no-console */
import express from 'express';
import volleyball from 'volleyball';
import bodyParser from 'body-parser';
import '@babel/polyfill';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import HTTP from 'http';
import socketsIO from 'socket.io';
import routes from './routes';
import config from './config';
import { OnlineUsers } from './models';
import UserController from './controllers/users';
import { generateCookies, refreshOnlineUsers } from './helpers/utils';

const { MONGODB_URL } = config;


// Set up the express app
const app = express();
app.use(cors());

// Log requests to the console.
app.use(volleyball);
// Mongo Connection Set-Up
mongoose.connect(MONGODB_URL, { useFindAndModify: false, useNewUrlParser: true });
mongoose.Promise = global.Promise;

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// parse request body content
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', routes);

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (_, res) =>
  res.status(404).json({ message: 'Page not found' }));


export const http = HTTP.createServer(app);

export const io = socketsIO(http);

io.on('connection', async (socket) => {
  console.log('New client connected');
  const cookies = generateCookies(socket);

  if (cookies.token) {
    const { _id: user } = jwt.decode(cookies.token);
    await OnlineUsers.findOneAndUpdate(
      { user },
      { user }, { new: true, upsert: true },
    );
    refreshOnlineUsers();
  }
  socket.on('userLeft', (user) => {
    UserController.logout(user._id);
  });
  socket.on('disconnect', async () => {
    console.log('Client disconnected');
    const xCookies = generateCookies(socket);

    if (xCookies.token) {
      const { _id: user } = jwt.decode(xCookies.token);
      await OnlineUsers.deleteOne({ user });
      refreshOnlineUsers();
    }
  });
});