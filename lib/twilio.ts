import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export { client as twilioClient };

export async function makeCall(params: {
  to: string;
  agentId: string;
  callbackUrl: string;
}) {
  const call = await client.calls.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to: params.to,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/api/calls/handle-twiml?agentId=${params.agentId}`,
    statusCallback: params.callbackUrl,
    statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
    record: true,
    recordingStatusCallback: params.callbackUrl
  });
  
  return call.sid;
}

export async function sendSMS(to: string, message: string) {
  return await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
    body: message
  });
}