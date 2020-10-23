/* eslint-disable no-console */
import express from 'express';
import path from 'path';
import volleyball from 'volleyball';
import bodyParser from 'body-parser';
import '@babel/polyfill';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import HTTP from 'http';
import socketsIO from 'socket.io';
import history from 'connect-history-api-fallback';
import routes from './routes';
import config from './config';
import { OnlineUsers } from './models';
import UserController from './controllers/users';
import { generateCookies, refreshOnlineUsers } from './helpers/utils';
import { gameErrors, gameSuccess } from './messages';

const { MONGODB_URL } = config;

// Set up the express app
const app = express();
app.use(cors());

// Log requests to the console.
app.use(volleyball);

try {
  mongoose.connect(MONGODB_URL, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Database connection successful');
} catch (error) {
  console.log('Database connection error: ', error);
}

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// parse request body content
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  history({
    rewrites: [
      {
        from: /^\/api\/.*$/,
        to(context) {
          return context.parsedUrl.path;
        },
      },
    ],
  })
);
app.use(express.static(path.join(__dirname, '../../client/dist')));

app.use('/api', routes);

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (_, res) => res.status(404).json({ message: 'Page not found' }));

export const http = HTTP.createServer(app);

export const io = socketsIO(http);

io.on('connection', async (socket) => {
  console.log('New client connected');
  const cookies = generateCookies(socket);

  if (cookies.token) {
    const { _id: user } = jwt.decode(cookies.token);
    await OnlineUsers.create({ user, socketId: socket.id });
    refreshOnlineUsers();
  }
  socket.on('userLeft', (user) => {
    UserController.onLogout(user, socket.id);
  });
  socket.on('userOnboard', (user) => {
    UserController.onLoginSignup(user._id, socket.id);
  });
  socket.on('inviteUser', async (invitee) => {
    const inviteCookie = generateCookies(socket);

    if (inviteCookie.token) {
      const inviteeTabs = await OnlineUsers.find({ user: invitee });
      const sender = jwt.decode(inviteCookie.token);

      inviteeTabs.forEach(({ socketId }) => {
        io.to(socketId).emit('inviteToPlay', {
          ...sender,
          socketId: socket.id,
        });
      });
    }
  });
  socket.on('wordDispatched', ({ listenerSocket }) => {
    io.to(listenerSocket).emit('wordDispatched', {
      questionerSocket: socket.id,
    });
  });
  socket.on('guessAnswer', ({ questionerSocket, guessAnswer }) => {
    io.to(questionerSocket).emit('guessAnswer', guessAnswer);
  });
  socket.on('wrongGuess', ({ listenerSocket }) => {
    io.to(listenerSocket).emit('wrongGuess', gameErrors.wrongGuess);
  });
  socket.on('gameOver', async ({ to, winner }) => {
    const current = await OnlineUsers.findOne({ socketId: socket.id });
    await OnlineUsers.updateMany(
      { user: { $in: [current.playingWith, current.user] } },
      { status: 'online' }
    );
    refreshOnlineUsers();
    const message =
      winner === 'czar' ? gameSuccess.gameEnd : gameSuccess.youWin;

    io.to(to).emit('gameOver', message);
  });
  socket.on('disconnect', async () => {
    console.log('Client disconnected');
    const xCookies = generateCookies(socket);

    if (!xCookies.token) return;
    const current = await OnlineUsers.findOneAndDelete({
      socketId: socket.id,
    });
    if (current?.status === 'playing') {
      const [peer] = await Promise.all([
        OnlineUsers.find({ user: current.playingWith }).exec(),
        OnlineUsers.updateMany(
          { user: { $in: [current.playingWith, current.user] } },
          { status: 'online' }
        ).exec(),
      ]);
      peer.forEach(({ socketId }) => {
        io.to(socketId).emit('receiverAccepted', false);
      });
    }
    refreshOnlineUsers();
  });
});
