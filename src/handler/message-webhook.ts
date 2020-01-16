import {Context} from 'koa';
import * as logger from '@src/service/logger';
import * as API from '@src/service/api';

const processMessageEvent = async function (event: any): Promise<any> {
  const userId = event.sender.id;
  const message = event.message.text;

  return await API.replyMessage(userId, message)
    .then(response => {
      console.log(response.data);
    });
};

const handleMessages = function (ctx: Context): void {
  const { body } = ctx.request;
  logger.info("%O", body);

  if (body.object === 'page') {
    for (const entry of body.entry) {
      for (const event of entry.messaging) {
        if (event.message?.text) {
          processMessageEvent(event);
        }
      }
    }

    ctx.status = 200;
    ctx.body = 'EVENT_RECEIVED';
  } else {
    ctx.body = 404;
  }
};

export default handleMessages;