import { mocked } from 'ts-jest/utils';
import { createMockContext } from '@shopify/jest-koa-mocks';
import { errorHandler } from './error-handler';
import GeneralError from './general-error';
import * as logger from '../service/logger';

jest.mock('../service/logger', () => ({
  info: jest.fn(),
  error: jest.fn()
}));

describe('test error handler', () => {

  beforeEach(() => {
    mocked(logger.info).mockClear();
    mocked(logger.error).mockClear();
  });

  test('handle general error', async () => {
    const ctx = createMockContext();

    await errorHandler(ctx, () => { 
      throw new GeneralError('test', 400);
    });

    expect(ctx.status).toBe(400);
    expect(ctx.body).toStrictEqual({ message: 'test' });
  });

  test('handle other error', async () => {
    const ctx = createMockContext();

    await errorHandler(ctx, () => { 
      throw new Error('test');
    });

    expect(ctx.status).toBe(500);
  });
});