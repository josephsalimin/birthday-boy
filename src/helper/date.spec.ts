import * as dateHelper from './date';

describe('testing date helper', () => {
  test('isValidDate should return false if given empty string', () => {
    expect(dateHelper.isValidDate('')).toBe(false);
  });
  
  test('isValidDate should return false if given date string with wrong format', () => {
    expect(dateHelper.isValidDate('1998-01-12')).toBe(false);
  });
  
  test('isValidDate should return false if year is < 1000', () => {
    expect(dateHelper.isValidDate('0999/01/12')).toBe(false);
  });

  test('isValidDate should return false if year is > 3000', () => {
    expect(dateHelper.isValidDate('30001/01/12')).toBe(false);
  });

  test('isValidDate should return false if month == 0', () => {
    expect(dateHelper.isValidDate('2020/00/12')).toBe(false);
  }); 

  test('isValidDate should return false if month > 12', () => {
    expect(dateHelper.isValidDate('2020/13/12')).toBe(false);
  }); 

  test('isValidDate should return false if year is not leap and day is bigger than 28 when month is february', () => {
    expect(dateHelper.isValidDate('2001/02/29')).toBe(false);
  }); 

  test('isValidDate should return true', () => {
    expect(dateHelper.isValidDate('2000/02/29')).toBe(true);
  }); 
});
