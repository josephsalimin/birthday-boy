import * as mongoose from 'mongoose';
import * as logger from '@src/service/logger';

const MONGOOSE_HOST = process.env.MONGOOSE_HOST || 'localhost';
const MONGOOSE_PORT = process.env.MONGOOSE_PORT || '27017';
const DATABASE = process.env.DATABASE; 

let isConnected = false;

const initiate = async function (): Promise<void> {
  if (!isConnected) {
    // Set up mongoose connection event handler
    mongoose.connection.on('connected', () => {
      logger.info('Connected to mongoose');
    });
    // Close connection if the process ends
    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        process.exit(0);
      });
    });

    await mongoose.connect(`mongodb://${MONGOOSE_HOST}:${MONGOOSE_PORT}/${DATABASE}`, { useNewUrlParser: true });
    isConnected = true; 
  }
};

export {
  initiate
};
