import { mocked } from 'ts-jest/utils';
import verify from './verify-webhook';
import * as logger from '../service/logger';
import { VERIFICATION_TOKEN } from '../const';
import { createMockContext } from '@shopify/jest-koa-mocks';

jest.mock('../service/logger', () => ({
  info: jest.fn()
}));

describe('testing verify-webhook', () => {

  beforeEach(() => {
    mocked(logger.info).mockClear();
  });

  it('verify success if mode === subscribe and token === verification_token', async () => {
    const ctx = createMockContext();
    ctx.request.query ={
      'hub.mode': 'subscribe',
      'hub.verify_token': VERIFICATION_TOKEN,
      'hub.challenge': 12345 
    };
		
    await verify(ctx);
		
    expect(logger.info).toBeCalledTimes(2);
    expect(ctx.body).toBe("12345");
    expect(ctx.status).toBe(200);
  });
	
  it('verify failed if mode !== subscribe or token !== verification_token', async () => {
    const ctx = createMockContext();
    ctx.request.query ={
      'hub.mode': 'not subscribe',
      'hub.verify_token': '1234',
      'hub.challenge': 12345 
    };
		
    await verify(ctx);
		
    expect(logger.info).toBeCalledTimes(1);
    expect(ctx.status).toBe(403);
  });
	
  it('verify failed if mode is empty or token is empty', async () => {
    const ctx = createMockContext();
    ctx.request.query ={
      'hub.challenge': 12345 
    };
		
    await verify(ctx);
		
    expect(logger.info).toBeCalledTimes(1);
    expect(ctx.status).toBe(403);
  });
});