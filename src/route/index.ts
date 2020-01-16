import * as Router from 'koa-router';
import webhookRouter from './webhook';

const router = new Router();

router.use(webhookRouter.routes());

export default router;