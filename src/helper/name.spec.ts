import * as nameHelper from './name';

describe('testing name helper ', () => {
  test('isValidFirstName should return false if given empty string', () => {
    expect(nameHelper.isValidFirstName('')).toBe(false);
  });
  
  test('isValidFirstName should return false if given string with lenght < 3', () => {
    expect(nameHelper.isValidFirstName('ab')).toBe(false);
  });
  
  test('isValidFirstName should return false some characters is not alphabet', () => {
    expect(nameHelper.isValidFirstName('test123!!')).toBe(false);
  });
  
  test('isValidFirstName should return true if success', () => {
    expect(nameHelper.isValidFirstName('joseph')).toBe(true); 
  });
});
