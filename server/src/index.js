/* eslint-disable no-console */
import express from 'express';
import volleyball from 'volleyball';
import bodyParser from 'body-parser';
import '@babel/polyfill';
import cors from 'cors';
import mongoose from 'mongoose';
import routes from './routes';
import config from './config';

const { MONGODB_URL, PORT } = config;


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

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

export default app;
