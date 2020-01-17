import * as nDaysHelper from './n-days';
import * as stringSimilarity from 'string-similarity';
import { THRESHOLD } from '../const';
import { User } from '../model/user';

describe('testing n-days helper', () => {
  
  test('isYes return false if text is not similar', () => {
    const mockedCompareTwoStrings = jest.spyOn(stringSimilarity, 'compareTwoStrings');
    mockedCompareTwoStrings.mockImplementation(() => THRESHOLD - 1);

    const response = nDaysHelper.isYes('not similar');

    expect(response).toBe(false);
    expect(mockedCompareTwoStrings).toBeCalled();

    mockedCompareTwoStrings.mockRestore();
  });

  test('isYes return true if text is similar', () => {
    const mockedCompareTwoStrings = jest.spyOn(stringSimilarity, 'compareTwoStrings');
    mockedCompareTwoStrings.mockImplementation(() => THRESHOLD + 1);

    const response = nDaysHelper.isYes('similar');
    
    expect(response).toBe(true);
    expect(mockedCompareTwoStrings).toBeCalled();

    mockedCompareTwoStrings.mockRestore();
  });

  test('isNot return false if text is not similar', () => {
    const mockedCompareTwoStrings = jest.spyOn(stringSimilarity, 'compareTwoStrings');
    mockedCompareTwoStrings.mockImplementation(() => THRESHOLD - 1);

    const response = nDaysHelper.isNo('not similar');
    
    expect(response).toBe(false);
    expect(mockedCompareTwoStrings).toBeCalled();

    mockedCompareTwoStrings.mockRestore();
  }); 

  test('isNot return true if text is similar', () => {
    const mockedCompareTwoStrings = jest.spyOn(stringSimilarity, 'compareTwoStrings');
    mockedCompareTwoStrings.mockImplementation(() => THRESHOLD + 1);

    const response = nDaysHelper.isNo('similar');
    
    expect(response).toBe(true);
    expect(mockedCompareTwoStrings).toBeCalled();

    mockedCompareTwoStrings.mockRestore();
  });
  
  test('get total days before next birthday', () => {
    const currentDate = new Date();
    const user = new User({ birthday: `${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()}` });

    const days = nDaysHelper.getTotalDaysBeforeNextBirthday(user);

    expect(days).toBe(0);
  });

  test('get total days before next birthday', () => {
    const currentDate = new Date();
    const previousDate = new Date();
    previousDate.setDate(currentDate.getDate() - 1);

    const user = new User({ birthday: `${previousDate.getFullYear()}/${previousDate.getMonth() + 1}/${previousDate.getDate()}` });

    const days = nDaysHelper.getTotalDaysBeforeNextBirthday(user);

    previousDate.setFullYear(previousDate.getFullYear() + 1);
    
    expect(days).toBe(Math.ceil((previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)));
  });
});