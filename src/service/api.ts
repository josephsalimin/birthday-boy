import axios, { AxiosResponse } from 'axios';

const FACEBOOK_URL = 'https://graph.facebook.com/v5.0';

export interface MessageProps {
  text: string;
  quick_replies?: any[];
}

const getDefaultHeaders = (): any => {
  return {
    'content-type': 'application/json'
  };
};

const buildReplyMessageResponse = (userId: string, messageProps: MessageProps): any => {
  return {
    messaging_type: 'RESPONSE',
    recipient: {
      id: userId
    },
    message: messageProps
  };
};

const replyMessage = async (userId: string, messageProps: MessageProps): Promise<AxiosResponse<any>> => {
  const payload: any = buildReplyMessageResponse(userId, messageProps);

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