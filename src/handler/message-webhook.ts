import {Context} from 'koa';
import * as logger from '@src/service/logger';
import * as API from '@src/service/api';
import { User, UserDocument } from '@src/model/user';
import { REPLY_MESSAGE } from '@src/const';
import * as util from 'util';
import * as dateHelper from '@src/helper/date';
import * as nameHelper from '@src/helper/name';

const processAddUserName = async function (event: any, user: UserDocument): Promise<any> {
  const userId = event.sender.id;
  const message = event.message.text;
  const name = message.split(' ')[0];
  let replyMessage;
  if (nameHelper.isValidName(name)) {
    user.name = name.charAt(0).toUpperCase() + name.slice(1);
    await user.save();

    replyMessage = util.format(REPLY_MESSAGE.NAME_ADDED, name);
  } else {
    replyMessage = util.format(REPLY_MESSAGE.INVALID_NAME);
  }

  return await API.replyMessage(userId, replyMessage);
};

const processAddBirthday = async function (event: any, user: UserDocument): Promise<any> {
  const userId = event.sender.id;
  const message = event.message.text;
  let replyMessage;
  
  if (dateHelper.isValidDate(message)) {
    // Split and get birthday with format DD-MM
    const parts = message.split("/");
    const day = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10);
    const birthday = `${day}-${month}`;

    user.birthday = birthday;
    await user.save();

    replyMessage = util.format(REPLY_MESSAGE.VALID_DATE);
  } else {
    replyMessage = util.format(REPLY_MESSAGE.INVALID_DATE);
  }

  return await API.replyMessage(userId, replyMessage);
};

const processRegisteredUser = async function (event: any, user: UserDocument): Promise<any> {  
  if (!user.name) {
    return await processAddUserName(event, user);  
  } else if (!user.birthday) {
    return await processAddBirthday(event, user);
  }
};

const processUnregisteredUser = async function (event: any): Promise<any> {
  const userId = event.sender.id;
  const user = new User({ facebookId: userId });
  await user.save();

  const replyMessage = util.format(REPLY_MESSAGE.NOT_REGISTERED);

  return await API.replyMessage(userId, replyMessage);
};

const processUnhandledError = async function (event: any): Promise<any> {
  const userId = event.sender.id;
  const replyMessage = util.format(REPLY_MESSAGE.ERROR);

  return await API.replyMessage(userId, replyMessage);
};

const processMessageEvent = async function (event: any): Promise<any> {
  const userId = event.sender.id;
  const user: UserDocument | null = await User.findOne({ facebookId: userId });

  try {
    if (!user) {
      return processUnregisteredUser(event);
    } else {
      return processRegisteredUser(event, user);
    }
  } catch (err) {
    return processUnhandledError(event);
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