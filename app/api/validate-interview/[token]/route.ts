import { NextRequest, NextResponse } from "next/server";
import { interviews } from "@/app/lib/interview-store";

export async function GET(
  req: NextRequest,
  context: { params: { token: string } },
) {
  const { token } = context.params;

  try {
    const interview = interviews.get(token);

    if (!interview || !interview.isActive) {
      return NextResponse.json(
        { error: "Interview session not found or inactive" },
        { status: 404 },
      );
    }

    if (interview.expiresAt && new Date(interview.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "Interview session has expired" },
        { status: 410 },
      );
    }

    return NextResponse.json(interview);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to validate interview" },
      { status: 500 },
    );
  }
}
