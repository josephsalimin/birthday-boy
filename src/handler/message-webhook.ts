import {Context} from 'koa';
import * as logger from '@src/service/logger';
import * as API from '@src/service/api';
import { AxiosResponse } from 'axios';
import { User, UserDocument } from '@src/model/user';
import { Message } from '@src/model/message';
import { REPLY_MESSAGE, QUICK_BUTTON } from '@src/const';
import * as util from 'util';
import * as dateHelper from '@src/helper/date';
import * as nameHelper from '@src/helper/name';
import * as nDaysHelper from '@src/helper/n-days';

const processAddUserName = async function (event: any, user: UserDocument): Promise<AxiosResponse<any>> {
  const message = event.message.text;
  const name = (message.split(' ')[0]);

  if (nameHelper.isValidFirstName(name)) {
    user.name = name.charAt(0).toUpperCase() + name.slice(1);
    await user.save();

    return await API.replyMessage(user.facebookId, { text: util.format(REPLY_MESSAGE.NAME_ADDED, user.name) } as API.MessageProps);
  } else {
    return await API.replyMessage(user.facebookId, { text: util.format(REPLY_MESSAGE.INVALID_NAME) } as API.MessageProps);
  }
};

const processAddBirthday = async function (event: any, user: UserDocument): Promise<AxiosResponse<any>> {
  const message = event.message.text;
  
  if (dateHelper.isValidDate(message)) {
    // Split and get birthday with format YYYY-MM-DD
    const parts = message.split("-");
    const day = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[0], 10);
    const birthday = `${year}/${month}/${day}`;

    user.birthday = birthday;
    await user.save();

    return await API.replyMessage(user.facebookId, { 
      text: util.format(REPLY_MESSAGE.VALID_DATE),
      quick_replies: QUICK_BUTTON 
    } as API.MessageProps);
  } else {
    return await API.replyMessage(user.facebookId, { text: util.format(REPLY_MESSAGE.INVALID_DATE) } as API.MessageProps);
  }
};

const processFullyRegistered = async function (event: any, user: UserDocument): Promise<AxiosResponse<any>> {
  const message = event.message.text.toLowerCase().replace(/[^a-z]/gi, '');

  if (nDaysHelper.isYes(message)) {
    return await API.replyMessage(user.facebookId, {
      text: util.format(REPLY_MESSAGE.ANSWER_NEXT_BIRTHDAY, nDaysHelper.getTotalDaysBeforeNextBirthday(user))
    });
  } else if (nDaysHelper.isNo(message)) {
    return await API.replyMessage(user.facebookId, {
      text: REPLY_MESSAGE.GOODBYE
    });
  } else {
    return await API.replyMessage(user.facebookId, {
      text: util.format(REPLY_MESSAGE.ASK_NEXT_BIRTHDAY, user.name),
      quick_replies: QUICK_BUTTON
    });
  }
};

const processRegisteredUser = async function (event: any, user: UserDocument): Promise<AxiosResponse<any>> {  
  if (!user.name) {
    return await processAddUserName(event, user);  
  } else if (!user.birthday) {
    return await processAddBirthday(event, user);
  } else {
    return await processFullyRegistered(event, user);
  }
};

const processUnregisteredUser = async function (event: any): Promise<AxiosResponse<any>> {
  const userId = event.sender.id;
  const user = new User({ facebookId: userId });
  await user.save();

  return await API.replyMessage(userId, { text: util.format(REPLY_MESSAGE.NOT_REGISTERED) } as API.MessageProps);
};

const processUnhandledError = async function (event: any): Promise<AxiosResponse<any>> {
  const userId = event.sender.id;

  return await API.replyMessage(userId, { text: util.format(util.format(REPLY_MESSAGE.ERROR)) } as API.MessageProps);
};

const processMessageEvent = async function (event: any): Promise<AxiosResponse<any>> {
  const userId = event.sender.id;
  const user: UserDocument | null = await User.findOne({ facebookId: userId });

  try {
    if (!user) {
      return await processUnregisteredUser(event);
    } else {
      return await processRegisteredUser(event, user);
    }
  } catch (err) {
    return await processUnhandledError(event);
  }
};

const addMessageLog = async function (event: any, response: AxiosResponse<any>): Promise<void> {
  const userId = event.sender.id;
  const input = event.message.text;
  const output = JSON.parse(response.config.data).message.text;

  const message = new Message({ userId, input, output, createdAt: (new Date()).getTime() });
  message.save().catch(e => logger.error(e));
};

const handleMessages = async function (ctx: Context): Promise<void> {
  const { body } = ctx.request;
  logger.info("%O", body);

  if (body.object === 'page') {
    for (const entry of body.entry) {
      for (const event of entry.messaging) {
        if (event.message?.text) {
          await processMessageEvent(event)
            .then(resp => addMessageLog(event, resp))
            .catch(err => logger.error(err));
        }
      }
    }
  }

  // Always return with status 200 to facebook server
  ctx.status = 200;
  ctx.body = 'EVENT_RECEIVED';
};

export default handleMessages;