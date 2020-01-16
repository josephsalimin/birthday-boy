import axios from 'axios';

const FACEBOOK_URL = 'https://graph.facebook.com/v5.0';

const getDefaultHeaders = (): any => {
  return {
    'content-type': 'application/json'
  };
};

const buildReplyMessageResponse = (userId: string, text: string): any => {
  return {
    messaging_type: 'RESPONSE',
    recipient: {
      id: userId
    },
    message: {
      text: text
    }
  };
};

const replyMessage = async (userId: string, text: string): Promise<any> => {
  const payload: any = buildReplyMessageResponse(userId, text);

  return await axios.post(
    `${FACEBOOK_URL}/me/messages`, 
    payload, 
    {
      params: { access_token: process.env.ACCESS_TOKEN },
      headers: getDefaultHeaders()
    });
};

export {
  replyMessage
};