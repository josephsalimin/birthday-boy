require('dotenv').config();

import * as http from 'http';
import * as logger from '@src/service/logger';
import * as mongooseClient from '@src/service/mongoose';

logger.initiate('bboy');

mongooseClient.initiate()
  .then(() => {
    const server = require('./server').default;
    const app = http.createServer(server.callback());
    const port = process.env.PORT || 5000;

    app.listen(port);
    app.on('listening', () => {
      logger.info(`Listening on ${port}`);
    });
  });
