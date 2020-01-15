require('dotenv').config();

import * as http from 'http';
import * as logger from '@src/service/logger';

logger.initiate('bboy');
const server = require('./server').default;
const app = http.createServer(server.callback());
const port = process.env.PORT || 5000;

app.listen(port);
app.on('listening', () => {
  logger.info(`Listening on ${port}`);
});
