import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { extractOutcome } from '@/lib/anthropic';
import { sendSMS } from '@/lib/twilio';

// Disable body parsing for Twilio webhooks
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  return NextResponse.json({ status: 'webhook ready' });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const callSid = formData.get('CallSid') as string;
    const callStatus = formData.get('CallStatus') as string;
    const recordingUrl = formData.get('RecordingUrl') as string;
    const duration = formData.get('CallDuration') as string;
    
    console.log('Webhook received:', { callSid, callStatus });
    
    const [calls]: any = await db.query(
      `SELECT c.*, t.*, u.phone, u.id as user_id 
       FROM calls c 
       JOIN tasks t ON c.task_id = t.id 
       JOIN users u ON t.user_id = u.id 
       WHERE c.twilio_call_sid = ?`,
      [callSid]
    );
    
    if (calls.length === 0) {
      console.log('Call not found:', callSid);
      return NextResponse.json({ error: 'Call not found' }, { status: 404 });
    }
    
    const call = calls[0];
    
    await db.query(
      'UPDATE calls SET status = ?, duration_seconds = ?, recording_url = ?, ended_at = ? WHERE twilio_call_sid = ?',
      [
        callStatus,
        duration ? parseInt(duration) : null,
        recordingUrl || null,
        callStatus === 'completed' ? new Date() : null,
        callSid
      ]
    );
    
    if (callStatus === 'completed') {
      const transcript = 'Call completed';
      const outcome = await extractOutcome(transcript);
      
      await db.query(
        'UPDATE calls SET transcript = ?, outcome = ?, outcome_details = ? WHERE twilio_call_sid = ?',
        [
          transcript,
          outcome.success ? 'success' : 'needs_review',
          JSON.stringify(outcome),
          callSid
        ]
      );
      
      await db.query(
        'UPDATE tasks SET status = ? WHERE id = ?',
        ['completed', call.task_id]
      );
      
      if (call.phone) {
        const taskDetails = typeof call.task_details === 'string' 
          ? JSON.parse(call.task_details) 
          : call.task_details;
        const message = outcome.success
          ? `✓ ${taskDetails.company} canceled. ${outcome.notes}`
          : `Call completed but needs review.`;
        
        await sendSMS(call.phone, message);
      }
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}