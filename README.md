# Birthday Boy
Facebook Messenger Bot to tell you how many days till your next birthday. You can access the page is from [this url](https://www.facebook.com/Birthday-Boy-105586807649806/). The backend server can be accessed from [this](https://birthday-boy-2020.herokuapp.com/messages). Birthday Boy is built using `typescript`, `koaJS`, and `mongoose`.

Created by: Joseph Salimin

## Prerequisites
- `node >= v8.0.0 and nodemon`
- `mongodb v4.2.2`

## How to install and to run the project
- `git clone https://github.com/josephsalimin/birthday-boy`
- `npm install`
- `cp .env.example .env` 
- fill .env with your environment
- `npm run start:prod`

## Features
- Message logging via `/messages` API (get list, get by id, delete by id)
- Can detect answer `yes` or `no` by inferring from text (though not advance)
- Can tell you how many days till your next birthday~
 
## Test Coverage
\>= 90%