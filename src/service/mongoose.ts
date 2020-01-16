import * as mongoose from 'mongoose';
import * as logger from '@src/service/logger';

const MONGO_URI = process.env.MONGO_URI; 

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

    await mongoose.connect(`mongodb://${MONGO_URI}`, { useNewUrlParser: true });
    isConnected = true; 
  }
};

export {
  initiate
};
