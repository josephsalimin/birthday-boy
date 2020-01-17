import { Message } from '../model/message';
import * as messageHandler from './message';
import { createMockContext } from '@shopify/jest-koa-mocks';

describe('test message handler', () => {
  
  test('get messages with userId', async () => {
    const messages = [new Message()];
    const mockedMessageFind = jest.spyOn(Message, 'find');
    mockedMessageFind.mockResolvedValue(messages);

    const ctx = createMockContext();
    ctx.request.query = {
      userId: 'userId'
    };

    await messageHandler.getMessages(ctx);

    expect(mockedMessageFind).toBeCalled();
    expect(mockedMessageFind).toBeCalledWith({ userId: 'userId' });
    expect(ctx.status).toBe(200);
    expect(ctx.body).toBe(messages);
  });

  test('get messages without userId', async () => {
    const messages = [new Message()];
    const mockedMessageFind = jest.spyOn(Message, 'find');
    mockedMessageFind.mockResolvedValue(messages);

    const ctx = createMockContext();

    await messageHandler.getMessages(ctx);

    expect(mockedMessageFind).toBeCalled();
    expect(mockedMessageFind).toBeCalledWith({});
    expect(ctx.status).toBe(200);
    expect(ctx.body).toBe(messages);
  });

  test('get message by id success', async () => {
    const message = new Message();
    const mockedMessageFindOne = jest.spyOn(Message, 'findById');
    mockedMessageFindOne.mockResolvedValue(message);

    const ctx = createMockContext();
    ctx.params = { id: 'messageId' };

    await messageHandler.getMessageById(ctx);

    expect(mockedMessageFindOne).toBeCalled();
    expect(mockedMessageFindOne).toBeCalledWith('messageId');
    expect(ctx.status).toBe(200);
    expect(ctx.body).toBe(message);
  });

  test('get message by id failed', async () => {
    const mockedMessageFindOne = jest.spyOn(Message, 'findById');
    mockedMessageFindOne.mockResolvedValue(null);

    const ctx = createMockContext();
    ctx.params = { id: 'messageId' };
    let isError = false;

    try {
      await messageHandler.getMessageById(ctx);
    } catch (e) {
      isError = true;
    }
    
    expect(mockedMessageFindOne).toBeCalled();
    expect(mockedMessageFindOne).toBeCalledWith('messageId');
    expect(isError).toBe(true);
  });

  test('delete message by id success', async () => {
    const message = new Message();
    const mockedMessageFindOne = jest.spyOn(Message, 'findById');
    mockedMessageFindOne.mockResolvedValue(message);

    const mockedRemove = jest.spyOn(Message.prototype, 'remove');
    mockedRemove.mockResolvedValue({ deletedCount: 1 });

    const ctx = createMockContext();
    ctx.params = { id: 'messageId' };

    await messageHandler.deleteMessageById(ctx);

    expect(mockedMessageFindOne).toBeCalled();
    expect(mockedMessageFindOne).toBeCalledWith('messageId');
    expect(mockedRemove).toBeCalled();
    expect(ctx.status).toBe(200);
    expect(ctx.body).toStrictEqual({ message: 'Success' });
  });

  test('delete message by id failed', async () => {
    const mockedMessageFindOne = jest.spyOn(Message, 'findById');
    mockedMessageFindOne.mockResolvedValue(null);

    const ctx = createMockContext();
    ctx.params = { id: 'messageId' };
    let isError = false;

    try {
      await messageHandler.deleteMessageById(ctx);
    } catch (e) {
      isError = true;
    }
    
    expect(mockedMessageFindOne).toBeCalled();
    expect(mockedMessageFindOne).toBeCalledWith('messageId');
    expect(isError).toBe(true);
  });
});