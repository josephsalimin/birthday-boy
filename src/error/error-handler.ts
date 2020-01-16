import * as logger from '@src/service/logger';
import GeneralError from '@src/error/general-error';

const env = process.env.NODE_ENV || "development";
const DEFAULT_ERROR_MSG = "Internal Server Error";

const handleGeneralError = (ctx, e: GeneralError): void => {
  ctx.status = e.errorCode;
  ctx.body = {
    message: e.message
  };
};

const handleError = (ctx, e: GeneralError | Error): void => {
  logger.error(e.stack);

  ctx.status = 500;
  const message = (env === "production") ? DEFAULT_ERROR_MSG : e.message;
  ctx.body = { message: message };
};

export const errorHandler = async (ctx, next): Promise<void> => {
  try {
    await next();
  } catch (e) {
    ctx.type = 'json';

    if (e.name === GeneralError.name) {
      handleGeneralError(ctx, e);
    } else {
      handleError(ctx, e);
    }
  }
};
