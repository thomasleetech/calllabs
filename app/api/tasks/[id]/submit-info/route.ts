import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateCallScript } from '@/lib/anthropic';
import { getCompanyPhone } from '@/lib/companies';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { answers } = await req.json();
    const resolvedParams = await params;
    const taskId = resolvedParams.id;
    
    const [tasks]: any = await db.query(
      'SELECT * FROM tasks WHERE id = ?',
      [taskId]
    );
    
    if (tasks.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    const task = tasks[0];
   const currentDetails = typeof task.task_details === 'string' 
  ? JSON.parse(task.task_details) 
  : task.task_details;
    const updatedDetails = { ...currentDetails, ...answers };
    
    await db.query(
      'UPDATE tasks SET task_details = ?, status = ? WHERE id = ?',
      [JSON.stringify(updatedDetails), 'script_generation', taskId]
    );
    
    const script = await generateCallScript({
      taskDetails: updatedDetails
    });
    
    const companyPhone = getCompanyPhone(updatedDetails.company);
    updatedDetails.companyPhone = companyPhone;
    
    await db.query(
      'UPDATE tasks SET call_script = ?, task_details = ?, status = ? WHERE id = ?',
      [JSON.stringify(script), JSON.stringify(updatedDetails), 'ready_for_approval', taskId]
    );
    
    return NextResponse.json({ 
      taskId,
      preview: script.summary,
      cost: 1200
    });
    
  } catch (error) {
    console.error('Submit info error:', error);
    return NextResponse.json(
      { error: 'Failed to process information' },
      { status: 500 }
    );
  }
}