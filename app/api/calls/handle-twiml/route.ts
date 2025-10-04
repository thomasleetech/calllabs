import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const agentId = searchParams.get('agentId');
  
  if (!agentId) {
    return new NextResponse('Missing agentId', { status: 400 });
  }
  
  const twiml = new twilio.twiml.VoiceResponse();
  
  const connect = twiml.connect();
  connect.stream({
    url: `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${agentId}`,
    track: 'both_tracks'
  });
  
  return new NextResponse(twiml.toString(), {
    headers: { 'Content-Type': 'text/xml' }
  });
}