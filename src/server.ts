import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as logger from 'koa-logger';
import * as bodyParser from 'koa-bodyparser';
import { errorHandler } from "@src/error/error-handler";
import router from "@src/route";

const server = new Koa();

server.use(logger());
server.use(bodyParser());
server.use(errorHandler);

const index = new Router();
index.get('/ping', (ctx) => {
  ctx.body = "Hello! Birthday Boy is online.";
});

server.use(index.routes());
server.use(router.routes());

export default server;
