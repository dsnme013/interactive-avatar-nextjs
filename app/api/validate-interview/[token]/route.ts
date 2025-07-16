// 4. app/api/validate-interview/[token]/route.ts
import { NextRequest, NextResponse } from 'next/server';
// Import the shared interviews map
import { interviews } from '../../save-interview/route';

type Params = {
  token: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { token } = await params;
    
    // Get interview from storage
    let interview = interviews.get(token);

    // For testing: if no interview exists, create a mock one
    if (!interview) {
      interview = {
        token: token,
        candidateName: 'Test Candidate',
        candidateEmail: 'test@example.com',
        companyName: 'Test Company',
        position: 'Software Engineer',
        knowledgeBaseId: 'kb_test_123',
        isActive: true,
        accessCount: 0,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
      // Store it for subsequent requests
      interviews.set(token, interview);
    }

    // Check if expired
    const expiryDate = new Date(interview.expiresAt);
    if (expiryDate < new Date()) {
      return NextResponse.json(
        { error: 'Interview session has expired' },
        { status: 410 }
      );
    }

    // Check if active
    if (!interview.isActive) {
      return NextResponse.json(
        { error: 'Interview session is no longer active' },
        { status: 403 }
      );
    }

    // Update access count
    interview.accessCount++;
    interview.lastAccessedAt = new Date().toISOString();
    interviews.set(token, interview);

    return NextResponse.json(interview);
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate interview' },
      { status: 500 }
    );
  }
}