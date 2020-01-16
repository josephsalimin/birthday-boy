import * as stringSimilarity from 'string-similarity';
import { THRESHOLD } from '@src/const';

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