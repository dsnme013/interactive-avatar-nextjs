// app/api/get-access-token/route.ts
import { NextRequest, NextResponse } from "next/server";

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!HEYGEN_API_KEY) {
      throw new Error("API key is missing from .env");
    }

    const baseApiUrl =
      process.env.NEXT_PUBLIC_BASE_API_URL || "https://api.heygen.com";

    const res = await fetch(`${baseApiUrl}/v1/streaming.create_token`, {
      method: "POST",
      headers: {
        "x-api-key": HEYGEN_API_KEY,
      },
    });

    console.log("Response status:", res.status);

    if (!res.ok) {
      throw new Error(`HeyGen API responded with status: ${res.status}`);
    }

    const data = await res.json();

    // Return the token in a consistent format
    return NextResponse.json({
      accessToken: data.data.token,
      success: true,
    });
  } catch (error) {
    console.error("Error retrieving access token:", error);

    return NextResponse.json(
      {
        error: "Failed to retrieve access token",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
