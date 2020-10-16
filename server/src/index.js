/* eslint-disable no-console */
import config from './config';
import { http } from './app';
import { OnlineUsers } from './models';

const port = config.PORT;

http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  OnlineUsers.deleteMany({}).exec();
});
