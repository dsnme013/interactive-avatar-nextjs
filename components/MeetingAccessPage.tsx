"use client"; // Ensure this is a client component

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { isValidMeetingCode } from "../utils/meetinglinkGenerator";

interface MeetingAccessPageProps {
  meetingCode?: string;
}

export default function MeetingAccessPage({
  meetingCode: propMeetingCode,
}: MeetingAccessPageProps) {
  // Using meetingCode passed as prop or from URL params
  const meetingCode = propMeetingCode;

  const [interview, setInterview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!meetingCode || !isValidMeetingCode(meetingCode)) {
      setError("Invalid meeting code format");
      setLoading(false);

      return;
    }

    // Look up interview by meeting code
    const interviews = JSON.parse(localStorage.getItem("interviews") || "{}");
    const interviewData = interviews[`meet-${meetingCode}`];

    if (!interviewData) {
      setError("Meeting not found");
      setLoading(false);

      return;
    }

    if (new Date(interviewData.expiresAt) < new Date()) {
      setError("This meeting link has expired");
      setLoading(false);

      return;
    }

    setInterview(interviewData);
    setLoading(false);
  }, [meetingCode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading meeting...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto text-center">
          <div className="mb-3 text-red-600 text-4xl">⚠️</div>
          <h2 className="text-xl font-bold mb-2 text-gray-900">
            Unable to Join Meeting
          </h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <Link
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            href="/"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg mx-auto text-center">
        <div className="text-green-600 text-3xl mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900">
          Ready to Join Interview
        </h2>
        <div className="mb-6 text-gray-700">
          <p className="font-mono text-lg mb-2">{meetingCode}</p>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Position:</strong> {interview.position}
            </p>
            <p>
              <strong>Company:</strong> {interview.companyName}
            </p>
            <p>
              <strong>Candidate:</strong> {interview.candidateName}
            </p>
          </div>
        </div>

        <Link
          aria-label="Join interview session"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          href={`/avatar-interview?kb=${interview.knowledgeBaseId}`}
        >
          Join Interview
        </Link>

        <div className="mt-6 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Tip:</strong> Make sure your camera and microphone are ready
            before joining.
          </p>
        </div>
      </div>
    </div>
  );
}
