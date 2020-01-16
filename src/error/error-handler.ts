import * as logger from '@src/service/logger';

const env = process.env.NODE_ENV || "development";
const DEFAULT_ERROR_MSG = "Internal Server Error";

const handleError = (ctx, e: Error): void => {
  logger.error(e.stack);
  // Always return 200 to facebook server :)
  ctx.status = 200;
  const message = (env === "production") ? DEFAULT_ERROR_MSG : e.message;
  ctx.body = { message: message };
};

export const errorHandler = async (ctx, next): Promise<void> => {
  try {
    await next();
  } catch (e) {
    ctx.type = 'json';
    handleError(ctx, e);
  }
};
