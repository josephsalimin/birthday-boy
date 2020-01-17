import * as stringSimilarity from 'string-similarity';
import { THRESHOLD } from '@src/const';
import { UserDocument } from '@src/model/user';

const YES_ANSWERS = [
  'yes',
  'y',
  'ok',
  'ye',
  'yeah',
  'yup',
  'alright'
];

const NO_ANSWERS = [
  'not',
  'n',
  'nope',
  'nah',
  'um no',
  'no'
];

export const isYes = (text: string): boolean => {
  for (const YES_ANSWER of YES_ANSWERS) {
    if (stringSimilarity.compareTwoStrings(text, YES_ANSWER) > THRESHOLD) {
      return true;
    }
  }

  return false;
};

export const isNo = (text: string): boolean => {
  for (const NO_ANSWER of NO_ANSWERS) {
    if (stringSimilarity.compareTwoStrings(text, NO_ANSWER) > THRESHOLD) {
      return true;
    }
  }

  return false;
};

export const getTotalDaysBeforeNextBirthday = function (user: UserDocument): number {
  const currentDate = new Date();
  currentDate.setHours(0);
  currentDate.setMinutes(0);
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);
  
  const parts = user.birthday.split("/");
  const day = parseInt(parts[2], 10);
  const month = parseInt(parts[1], 10);    

  const birthday = new Date(currentDate.getFullYear(), month - 1, day);

  if (birthday < currentDate) {
    birthday.setFullYear(birthday.getFullYear() + 1);
  }

  return Math.ceil((birthday.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)); 
};