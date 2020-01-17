import { mocked } from 'ts-jest/utils';
import * as util from 'util';
import { createMockContext } from '@shopify/jest-koa-mocks';
import handleMessages from './message-webhook';
import * as API from '../service/api';
import * as logger from '../service/logger';
import { Message } from '../model/message';
import { User } from '../model/user'; 
import { REPLY_MESSAGE, QUICK_BUTTON } from '../const';
import * as dateHelper from '../helper/date';
import * as nameHelper from '../helper/name';
import * as nDaysHelper from '../helper/n-days';

jest.mock('../service/logger', () => ({
  info: jest.fn(),
  error: jest.fn()
}));

const mockedAPISuccess = {
  config: {
    data: JSON.stringify({ message: { text: 'text' }})
  }
};

const eventMessages = [{ message: { text: 'text' } , sender: { id: 'senderId' } }];

const mockedUserFindOne = jest.spyOn(User, 'findOne');
const mockedUserSave = jest.spyOn(User.prototype, 'save');
const mockedAPIReplyMessage = jest.spyOn(API, 'replyMessage');
const mockedMessageSave = jest.spyOn(Message.prototype, 'save');
const mockedIsValidFirstName = jest.spyOn(nameHelper, 'isValidFirstName');
const mockedIsValidDate = jest.spyOn(dateHelper, 'isValidDate');
const mockedIsYes = jest.spyOn(nDaysHelper, 'isYes');
const mockedIsNo = jest.spyOn(nDaysHelper, 'isNo');
const mockedGetTotalDaysBeforeNextBirthday = jest.spyOn(nDaysHelper, 'getTotalDaysBeforeNextBirthday');

describe('test message-webhook handler', () => {
  
  beforeEach(() => {
    mocked(logger.info).mockClear();
    mocked(logger.error).mockClear();
    mockedUserFindOne.mockReset();
    mockedUserSave.mockReset();
    mockedAPIReplyMessage.mockReset();
    mockedMessageSave.mockReset();
    mockedIsValidFirstName.mockReset();
    mockedIsValidDate.mockReset();
    mockedIsYes.mockReset();
    mockedIsNo.mockReset();
    mockedGetTotalDaysBeforeNextBirthday.mockReset();
  });

  test('process body.object !== page', async () => {
    mockedUserFindOne.mockResolvedValue(null);
    mockedUserSave.mockResolvedValue({});
    mockedAPIReplyMessage.mockResolvedValue(mockedAPISuccess as any);
    mockedMessageSave.mockResolvedValue({});

    const ctx = createMockContext();
    ctx.request.body = {
      object: 'not page',
      entry: [{
        messaging: eventMessages
      }]
    };

    await handleMessages(ctx);

    expect(mockedUserFindOne).not.toBeCalled();
    expect(mockedUserSave).not.toBeCalled();
    expect(mockedAPIReplyMessage).not.toBeCalled();
    expect(mockedMessageSave).not.toBeCalled();
    expect(ctx.status).toBe(200);
  });

  test('process event.message null', async () => {
    mockedUserFindOne.mockResolvedValue(null);
    mockedUserSave.mockResolvedValue({});
    mockedAPIReplyMessage.mockResolvedValue(mockedAPISuccess as any);
    mockedMessageSave.mockResolvedValue({});

    const ctx = createMockContext();
    ctx.request.body = {
      object: 'page',
      entry: [{
        messaging: [{ message: null }]
      }]
    };

    await handleMessages(ctx);

    expect(mockedUserFindOne).not.toBeCalled();
    expect(mockedUserSave).not.toBeCalled();
    expect(mockedAPIReplyMessage).not.toBeCalled();
    expect(mockedMessageSave).not.toBeCalled();
    expect(ctx.status).toBe(200);
  });

  test('process event.message.text null', async () => {
    mockedUserFindOne.mockResolvedValue(null);
    mockedUserSave.mockResolvedValue({});
    mockedAPIReplyMessage.mockResolvedValue(mockedAPISuccess as any);
    mockedMessageSave.mockResolvedValue({});

    const ctx = createMockContext();
    ctx.request.body = {
      object: 'page',
      entry: [{
        messaging: [{ message: { text: null } }]
      }]
    };

    await handleMessages(ctx);

    expect(mockedUserFindOne).not.toBeCalled();
    expect(mockedUserSave).not.toBeCalled();
    expect(mockedAPIReplyMessage).not.toBeCalled();
    expect(mockedMessageSave).not.toBeCalled();
    expect(ctx.status).toBe(200);
  });
  
  test('process failed replyMessage', async () => {
    mockedUserFindOne.mockResolvedValue(null);
    mockedUserSave.mockResolvedValue({});
    mockedAPIReplyMessage.mockRejectedValue(new Error());
    mockedMessageSave.mockResolvedValue({});

    const ctx = createMockContext();
    ctx.request.body = {
      object: 'page',
      entry: [{
        messaging: eventMessages
      }]
    };

    await handleMessages(ctx);

    expect(mockedUserFindOne).toBeCalled();
    expect(mockedUserSave).toBeCalled();
    expect(mockedAPIReplyMessage).toBeCalled();
    expect(mockedAPIReplyMessage).toBeCalledWith('senderId', { text: util.format(REPLY_MESSAGE.NOT_REGISTERED) });
    expect(mockedMessageSave).not.toBeCalled();
    expect(ctx.status).toBe(200); 
  });

  test('process unregistered user', async () => {
    mockedUserFindOne.mockResolvedValue(null);
    mockedUserSave.mockResolvedValue({});
    mockedAPIReplyMessage.mockResolvedValue(mockedAPISuccess as any);
    mockedMessageSave.mockResolvedValue({});

    const ctx = createMockContext();
    ctx.request.body = {
      object: 'page',
      entry: [{
        messaging: eventMessages
      }]
    };

    await handleMessages(ctx);

    expect(mockedUserFindOne).toBeCalled();
    expect(mockedUserSave).toBeCalled();
    expect(mockedAPIReplyMessage).toBeCalled();
    expect(mockedAPIReplyMessage).toBeCalledWith('senderId', { text: util.format(REPLY_MESSAGE.NOT_REGISTERED) });
    expect(mockedMessageSave).toBeCalled();
    expect(ctx.status).toBe(200);
  });

  test('process registered user: add user name success', async () => {
    mockedUserFindOne.mockResolvedValue(new User({facebookId: 'senderId'}));
    mockedIsValidFirstName.mockReturnValue(true);
    mockedUserSave.mockResolvedValue({});
    mockedAPIReplyMessage.mockResolvedValue(mockedAPISuccess as any);
    mockedMessageSave.mockResolvedValue({});

    const ctx = createMockContext();
    ctx.request.body = {
      object: 'page',
      entry: [{
        messaging: eventMessages
      }]
    };

    await handleMessages(ctx);

    expect(mockedUserFindOne).toBeCalled();
    expect(mockedIsValidFirstName).toBeCalledWith('text');
    expect(mockedUserSave).toBeCalled();
    expect(mockedAPIReplyMessage).toBeCalled();
    expect(mockedAPIReplyMessage).toBeCalledWith('senderId', { text: util.format(REPLY_MESSAGE.NAME_ADDED, 'Text') });
    expect(mockedMessageSave).toBeCalled();
    expect(ctx.status).toBe(200);
  });

  test('process registered user: add user name failed', async () => {
    mockedUserFindOne.mockResolvedValue(new User({facebookId: 'senderId'}));
    mockedIsValidFirstName.mockReturnValue(false);
    mockedUserSave.mockResolvedValue({});
    mockedAPIReplyMessage.mockResolvedValue(mockedAPISuccess as any);
    mockedMessageSave.mockResolvedValue({});

    const ctx = createMockContext();
    ctx.request.body = {
      object: 'page',
      entry: [{
        messaging: eventMessages
      }]
    };

    await handleMessages(ctx);

    expect(mockedUserFindOne).toBeCalled();
    expect(mockedIsValidFirstName).toBeCalledWith('text'); 
    expect(mockedAPIReplyMessage).toBeCalled();
    expect(mockedAPIReplyMessage).toBeCalledWith('senderId', { text: util.format(REPLY_MESSAGE.INVALID_NAME) });
    expect(mockedMessageSave).toBeCalled();
    expect(ctx.status).toBe(200);
  });

  test('process registered user: add birthday success', async () => {
    mockedUserFindOne.mockResolvedValue(new User({facebookId: 'senderId', name: 'sender'}));
    mockedIsValidDate.mockReturnValue(true);
    mockedUserSave.mockResolvedValue({});
    mockedAPIReplyMessage.mockResolvedValue(mockedAPISuccess as any);
    mockedMessageSave.mockResolvedValue({});

    const ctx = createMockContext();
    ctx.request.body = {
      object: 'page',
      entry: [{
        messaging: [{ message: { text: '1998/06/19' } , sender: { id: 'senderId' } }]
      }]
    };

    await handleMessages(ctx);

    expect(mockedUserFindOne).toBeCalled();
    expect(mockedIsValidDate).toBeCalledWith('1998/06/19');
    expect(mockedUserSave).toBeCalled();
    expect(mockedAPIReplyMessage).toBeCalled();
    expect(mockedAPIReplyMessage).toBeCalledWith('senderId', { 
      text: util.format(REPLY_MESSAGE.VALID_DATE),
      quick_replies: QUICK_BUTTON 
    });
    expect(mockedMessageSave).toBeCalled();
    expect(ctx.status).toBe(200);
  });  

  test('process registered user: add birthday failed', async () => {
    mockedUserFindOne.mockResolvedValue(new User({facebookId: 'senderId', name: 'sender'}));
    mockedIsValidDate.mockReturnValue(false);
    mockedUserSave.mockResolvedValue({});
    mockedAPIReplyMessage.mockResolvedValue(mockedAPISuccess as any);
    mockedMessageSave.mockResolvedValue({});

    const ctx = createMockContext();
    ctx.request.body = {
      object: 'page',
      entry: [{
        messaging: [{ message: { text: '1998/06/19' } , sender: { id: 'senderId' } }]
      }]
    };

    await handleMessages(ctx);

    expect(mockedUserFindOne).toBeCalled();
    expect(mockedIsValidDate).toBeCalledWith('1998/06/19');
    expect(mockedAPIReplyMessage).toBeCalled();
    expect(mockedAPIReplyMessage).toBeCalledWith('senderId', { 
      text: util.format(REPLY_MESSAGE.INVALID_DATE)
    });
    expect(mockedMessageSave).toBeCalled();
    expect(ctx.status).toBe(200);
  }); 
  
  test('process registered user: answering yes for next birthday', async () => {
    mockedUserFindOne.mockResolvedValue(new User({facebookId: 'senderId', name: 'sender', birthday: '1998/6/19'}));
    mockedIsYes.mockReturnValue(true);
    mockedGetTotalDaysBeforeNextBirthday.mockReturnValue(0);
    mockedAPIReplyMessage.mockResolvedValue(mockedAPISuccess as any);
    mockedMessageSave.mockResolvedValue({});

    const ctx = createMockContext();
    ctx.request.body = {
      object: 'page',
      entry: [{
        messaging: eventMessages
      }]
    };

    await handleMessages(ctx);

    expect(mockedUserFindOne).toBeCalled();
    expect(mockedIsYes).toBeCalled();
    expect(mockedGetTotalDaysBeforeNextBirthday).toBeCalled();
    expect(mockedAPIReplyMessage).toBeCalled();
    expect(mockedAPIReplyMessage).toBeCalledWith('senderId', { 
      text: util.format(REPLY_MESSAGE.ANSWER_NEXT_BIRTHDAY, 0)
    });
    expect(mockedMessageSave).toBeCalled();
    expect(ctx.status).toBe(200);
  }); 
  
  test('process registered user: anwering no for next birthday', async () => {
    mockedUserFindOne.mockResolvedValue(new User({facebookId: 'senderId', name: 'sender', birthday: '1998/6/19'}));
    mockedIsYes.mockReturnValue(false);
    mockedIsNo.mockReturnValue(true);
    mockedAPIReplyMessage.mockResolvedValue(mockedAPISuccess as any);
    mockedMessageSave.mockResolvedValue({});

    const ctx = createMockContext();
    ctx.request.body = {
      object: 'page',
      entry: [{
        messaging: eventMessages
      }]
    };

    await handleMessages(ctx);

    expect(mockedUserFindOne).toBeCalled();
    expect(mockedIsYes).toBeCalled();
    expect(mockedIsNo).toBeCalled();
    expect(mockedGetTotalDaysBeforeNextBirthday).not.toBeCalled();
    expect(mockedAPIReplyMessage).toBeCalled();
    expect(mockedAPIReplyMessage).toBeCalledWith('senderId', { 
      text: REPLY_MESSAGE.GOODBYE
    });
    expect(mockedMessageSave).toBeCalled();
    expect(ctx.status).toBe(200);
  }); 
  
  test('process registered user: other answer', async () => {
    mockedUserFindOne.mockResolvedValue(new User({facebookId: 'senderId', name: 'sender', birthday: '1998/6/19'}));
    mockedIsYes.mockReturnValue(false);
    mockedIsNo.mockReturnValue(false);
    mockedAPIReplyMessage.mockResolvedValue(mockedAPISuccess as any);
    mockedMessageSave.mockResolvedValue({});

    const ctx = createMockContext();
    ctx.request.body = {
      object: 'page',
      entry: [{
        messaging: eventMessages
      }]
    };

    await handleMessages(ctx);

    expect(mockedUserFindOne).toBeCalled();
    expect(mockedIsYes).toBeCalled();
    expect(mockedIsNo).toBeCalled();
    expect(mockedGetTotalDaysBeforeNextBirthday).not.toBeCalled();
    expect(mockedAPIReplyMessage).toBeCalled();
    expect(mockedAPIReplyMessage).toBeCalledWith('senderId', {
      text: util.format(REPLY_MESSAGE.ASK_NEXT_BIRTHDAY, 'sender'),
      quick_replies: QUICK_BUTTON
    });
    expect(mockedMessageSave).toBeCalled();
    expect(ctx.status).toBe(200);
  }); 
  
  test('process messave save error', async () => {
    mockedUserFindOne.mockResolvedValue(null);
    mockedUserSave.mockResolvedValue({});
    mockedAPIReplyMessage.mockResolvedValue(mockedAPISuccess as any);
    mockedMessageSave.mockRejectedValue(new Error());

    const ctx = createMockContext();
    ctx.request.body = {
      object: 'page',
      entry: [{
        messaging: eventMessages
      }]
    };

    await handleMessages(ctx);

    expect(mockedUserFindOne).toBeCalled();
    expect(mockedUserSave).toBeCalled();
    expect(mockedAPIReplyMessage).toBeCalled();
    expect(mockedAPIReplyMessage).toBeCalledWith('senderId', { text: util.format(REPLY_MESSAGE.NOT_REGISTERED) });
    expect(mockedMessageSave).toBeCalled();
    expect(ctx.status).toBe(200);
  });
});