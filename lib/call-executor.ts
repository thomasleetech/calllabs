import { db } from './db';
import { v4 as uuidv4 } from 'uuid';
import { createConversationalAgent } from './elevenlabs';
import { makeCall } from './twilio';

export async function executeCall(taskId: string) {
  const [tasks]: any = await db.query(
    'SELECT * FROM tasks WHERE id = ?',
    [taskId]
  );
  
  if (tasks.length === 0) throw new Error('Task not found');
  
  const task = tasks[0];
const script = typeof task.call_script === 'string' 
  ? JSON.parse(task.call_script) 
  : task.call_script;
const details = typeof task.task_details === 'string' 
  ? JSON.parse(task.task_details) 
  : task.task_details;
  
  const agentId = await createConversationalAgent({
    systemPrompt: script.full_instructions,
    firstMessage: script.opening
  });
  
  const callSid = await makeCall({
    to: details.companyPhone,
    agentId,
    callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/calls/webhook`
  });
  
  await db.query(
    'INSERT INTO calls (id, task_id, twilio_call_sid, target_phone, status, started_at) VALUES (?, ?, ?, ?, ?, NOW())',
    [uuidv4(), taskId, callSid, details.companyPhone, 'initiated']
  );
  
  await db.query(
    'UPDATE tasks SET status = ? WHERE id = ?',
    ['calling', taskId]
  );
}