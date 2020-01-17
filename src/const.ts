
export const REPLY_MESSAGE = {
  NOT_REGISTERED: `
    Hi! We've detected that you are currently not registered in our server.\nPlease provide use first with your first name! Thank you!
  `,
  INVALID_NAME: `Can you please restate your name? Thank you!`,
  NAME_ADDED: `
    Hello %s! It is very nice to know you! For further registration, can you provide me your birthday (YYYY-MM-DD format)? Thank you!
  `,
  INVALID_DATE: `Please input date with YYYY-MM-DD format! Thank you :)`,
  VALID_DATE: `Thank you for your input! Do you want to know how many days till your next birthday?`,
  ASK_NEXT_BIRTHDAY: `Hi %s! Do you want to know how many days till your next birthday?`,
  ANSWER_NEXT_BIRTHDAY: `There are %d days left until your next birthday~`,
  GOODBYE: `Goodbye 👋🏻`,
  ERROR: `Sorry! Something is error :(...`
};

export const THRESHOLD = 0.75;

export const QUICK_BUTTON = [
  {
    "content_type":"text",
    "title":"Yes",
    "payload":"yes",
  },{
    "content_type":"text",
    "title":"No",
    "payload":"no"
  }
];

export const VERIFICATION_TOKEN = 'BBOY2020';
