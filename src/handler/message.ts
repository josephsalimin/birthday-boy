import { Message } from '@src/model/message';
import { Context } from 'koa';
import GeneralError from '@src/error/general-error';

const getMessages = async (ctx: Context): Promise<void> => {
  const userId = ctx.request.query.userId;
  const queryOptions: any = {};
  if (userId) {
    queryOptions.userId = userId;
  }

  const messages = await Message.find(queryOptions);

  ctx.body = messages;
};

const getMessageById = async (ctx: Context): Promise<void> => {
  const messageId = ctx.params.id;
  const message = await Message.findById(messageId);

  if (!message) {
    throw new GeneralError('Not found', 404); 
  }
  
  ctx.body = message;
};

const deleteMessageById = async (ctx: Context): Promise<void> => {
  const messageId = ctx.params.id;
  const message = await Message.findById(messageId);

  if (!message) {
    throw new GeneralError('Not found', 404); 
  }
  
  await message.remove();

  ctx.body = {
    message: 'Success'
  };
}; 

export {
  getMessages,
  getMessageById,
  deleteMessageById
};