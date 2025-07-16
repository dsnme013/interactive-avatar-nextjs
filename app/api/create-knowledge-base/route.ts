// 3. app/api/create-knowledge-base/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { companyName, position, jobDescription } = await request.json();

    // Generate a mock knowledge base ID
    const knowledgeBaseId = `kb_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    return NextResponse.json({
      knowledgeBaseId,
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create knowledge base" },
      { status: 500 },
    );
  }
}
