import verify from '@src/handler/verify-webhook';
import handleMessages from '@src/handler/message-webhook';
import * as Router from 'koa-router';

const router = new Router({
  prefix: '/webhook'
});
  
router.get('/', verify);
router.post('/', handleMessages);

export default router;