import {Context} from 'koa';
import * as logger from '@src/service/logger';
import * as API from '@src/service/api';
import { User, UserDocument } from '@src/model/user';

const processRegisteredUser = async function (event: any, user: UserDocument): Promise<any> {
  const userId = event.sender.id;
  const message = event.message.text;

  if (!user.name) {

  }
  
  return await API.replyMessage(userId, 'test\ntest');
};

const processUnregisteredUser = async function (event: any): Promise<any> {
  const userId = event.sender.id;
  const user = new User({ facebookId: userId });
  await user.save();

  const replyMessage = `
    Hi! We've detected that you are currently not registered in our server.\n
    Please provide use first with your first name! Thank you!
  `;

  return await API.replyMessage(userId, replyMessage);
};

const processMessageEvent = async function (event: any): Promise<any> {
  const userId = event.sender.id;
  const user: UserDocument | null = await User.findOne({ facebookId: userId });

  if (!user) {
    return processUnregisteredUser(event);
  } else {
    return processRegisteredUser(event, user);
  }
};

const handleMessages = function (ctx: Context): void {
  const { body } = ctx.request;
  logger.info("%O", body);

  if (body.object === 'page') {
    for (const entry of body.entry) {
      for (const event of entry.messaging) {
        if (event.message?.text) {
          processMessageEvent(event)
            .catch(err => {
              logger.error(err.message);
            });
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