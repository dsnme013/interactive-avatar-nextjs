// 2. app/api/send-interview-email/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      candidateEmail,
      candidateName,
      interviewLink,
      position,
      companyName,
    } = await request.json();

    // TODO: Integrate with your email service
    console.log("Sending email to:", candidateEmail);
    console.log("Interview link:", interviewLink);

    // For now, just return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
