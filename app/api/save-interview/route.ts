// 1. app/api/save-interview/route.ts
import { NextRequest, NextResponse } from 'next/server';

// In-memory storage (replace with database in production)
const interviews = new Map();

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Store interview data
    interviews.set(data.token, {
      ...data,
      id: Math.random().toString(36).substring(2),
      createdAt: new Date().toISOString(),
      isActive: true,
      accessCount: 0,
    });

    return NextResponse.json({ 
      success: true, 
      token: data.token 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save interview' },
      { status: 500 }
    );
  }
}

// Do NOT export `interviews` here!
