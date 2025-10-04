import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const [result]: any = await db.query('SELECT 1 + 1 AS solution');
    return NextResponse.json({ 
      success: true, 
      result: result[0].solution,
      message: 'Database connected successfully'
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      code: error.code
    }, { status: 500 });
  }
}