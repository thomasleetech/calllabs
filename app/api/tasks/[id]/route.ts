import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { stripe } from '@/lib/stripe';
import { executeCall } from '@/lib/call-executor';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { paymentMethodId } = await req.json();
    const taskId = params.id;
    
    const [tasks]: any = await db.query(
      `SELECT t.*, u.email, u.stripe_customer_id, u.id as user_id 
       FROM tasks t 
       JOIN users u ON t.user_id = u.id 
       WHERE t.id = ?`,
      [taskId]
    );
    
    if (tasks.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    const task = tasks[0];
    
    let customerId = task.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: task.email,
      });
      customerId = customer.id;
      
      await db.query(
        'UPDATE users SET stripe_customer_id = ? WHERE id = ?',
        [customerId, task.user_id]
      );
    }
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1200,
      currency: 'usd',
      customer: customerId,
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    });
    
    await db.query(
      'INSERT INTO payments (id, user_id, task_id, stripe_payment_intent_id, amount_cents, status) VALUES (?, ?, ?, ?, ?, ?)',
      [uuidv4(), task.user_id, taskId, paymentIntent.id, 1200, paymentIntent.status]
    );
    
    await db.query(
      'UPDATE tasks SET status = ? WHERE id = ?',
      ['approved', taskId]
    );
    
    executeCall(taskId).catch(err => 
      console.error('Call execution error:', err)
    );
    
    return NextResponse.json({ success: true, taskId });
    
  } catch (error) {
    console.error('Approval error:', error);
    return NextResponse.json(
      { error: 'Failed to process approval' },
      { status: 500 }
    );
  }
}