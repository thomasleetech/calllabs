import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { generateQuestions } from '@/lib/anthropic';

export async function POST(req: NextRequest) {
  try {
    const { email, taskType, initialInput } = await req.json();
    
    const [users]: any = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    let userId;
    if (users.length === 0) {
      userId = uuidv4();
      await db.query(
        'INSERT INTO users (id, email) VALUES (?, ?)',
        [userId, email]
      );
    } else {
      userId = users[0].id;
    }
    
    const taskId = uuidv4();
    await db.query(
      'INSERT INTO tasks (id, user_id, task_type, status, task_details) VALUES (?, ?, ?, ?, ?)',
      [taskId, userId, taskType, 'info_gathering', JSON.stringify({ company: initialInput })]
    );
    
    const questions = await generateQuestions({ 
      taskDetails: { company: initialInput } 
    });
    
    return NextResponse.json({ taskId, questions });
    
  } catch (error) {
    console.error('Task creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}