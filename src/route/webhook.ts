import verify from '@src/handler/verify-webhook';
import * as Router from 'koa-router';

const router = new Router({
  prefix: '/webhook'
});
  
router.get('/', verify);

export default router;