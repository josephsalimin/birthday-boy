import {Context} from 'koa';
import { VERIFICATION_TOKEN } from '@src/const';
import * as logger from '@src/service/logger';

const verify = async function (ctx: Context): Promise<void> {
  const { query } = ctx.request;

  logger.info("%O", query);

  const mode = query['hub.mode'];
  const token = query['hub.verify_token'];
  const challenge = query['hub.challenge'];  

  if (mode && token) {
    if (mode === 'subscribe' && 
        token === VERIFICATION_TOKEN) {
      logger.info("Verified");
      ctx.body = challenge;

      return;
    }
  } 

  ctx.status = 403;
};

export default verify;