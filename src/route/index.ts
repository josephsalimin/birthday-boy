import * as Router from 'koa-router';
import webhookRouter from './webhook';
import messageRouter from './message';

const router = new Router();

router.use(webhookRouter.routes());
router.use(messageRouter.routes());

export default router;