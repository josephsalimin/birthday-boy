
export function isValidDate(dateString: string): boolean {
  // First check for the pattern
  const regexDate = /^\d{4}\/\d{1,2}\/\d{1,2}$/;

  if (!regexDate.test(dateString)) {
    return false;
  }

  // Parse the date parts to integers
  const parts = dateString.split("/");
  const day = parseInt(parts[2], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[0], 10);

  // Check the ranges of month and year
  if (year < 1000 || year > 3000 || month == 0 || month > 12) {
    return false;
  }

  const MONTH_LENGTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  // Adjust for leap years
  if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
    MONTH_LENGTH[1] = 29;
  }

  // Check the range of the day
  return day > 0 && day <= MONTH_LENGTH[month - 1];
}