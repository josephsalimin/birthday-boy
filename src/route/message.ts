import { deleteMessageById, getMessages, getMessageById } from '@src/handler/message';
import * as Router from 'koa-router';

const router = new Router({
  prefix: '/messages'
});
  
router.get('/', getMessages);
router.get('/:id', getMessageById);
router.delete('/:id', deleteMessageById);

export default router;