/* eslint-disable no-console */
import express from 'express';
import path from 'path';
import volleyball from 'volleyball';
import bodyParser from 'body-parser';
import '@babel/polyfill';
import cors from 'cors';
import mongoose from 'mongoose';
import HTTP from 'http';
import socketsIO from 'socket.io';
import history from 'connect-history-api-fallback';
import routes from './routes';
import config from './config';
import { SocketController } from './controllers';

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

io.on('connection', (socket) => SocketController(socket, io));
