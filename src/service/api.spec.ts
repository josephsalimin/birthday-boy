import * as API from './api';
import axios from 'axios';

describe('testing api', () => {

  test('reply message return resolved promise', async () => {
    const mockedPostRequest = jest.spyOn(axios, 'post');
    mockedPostRequest.mockImplementation(() => Promise.resolve({}));

    let isError = false;
    try {
      await API.replyMessage('anyUserId', { text: 'anyText'});
    } catch (e) {
      isError = true;
    }

    expect(isError).toBe(false);
  });

  test('reply message return rejected promise', async () => {
    const mockedPostRequest = jest.spyOn(axios, 'post');
    mockedPostRequest.mockImplementation(() => Promise.reject(new Error('any error')));

    let isError = false;
    try {
      await API.replyMessage('anyUserId', { text: 'anyText'});
    } catch (e) {
      isError = true;
    }

    expect(isError).toBe(true);
  });
});