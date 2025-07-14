// /components/SecureInterviewAccessPage.tsx

import React, { useEffect, useState } from "react";

// (No need for getInterviewByToken or isExpired helpers since we do it inline now)

function AccessErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto text-center">
        <div className="mb-3 text-red-600 text-4xl">⚠️</div>
        <h2 className="text-xl font-bold mb-2 text-gray-900">Access Error</h2>
        <div className="mb-4 text-gray-700">
          This interview link is <b>invalid or has expired</b>.
          <ul className="text-sm mt-2 text-left list-disc pl-6 text-gray-500">
            <li>The link may have already been used or is expired.</li>
            <li>Check that you copied the entire link exactly from your invitation.</li>
            <li>
              If you're seeing this during development, links become invalid if you clear browser storage.
            </li>
            <li>
              If you are the candidate, please contact the organizer for a new invitation.
            </li>
          </ul>
        </div>
        <a
          href="/"
          className="inline-block mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
}

export default function SecureInterviewAccessPage({ accessToken }: { accessToken: string }) {
  const [interview, setInterview] = useState<any>(null);
  const [valid, setValid] = useState<null | boolean>(null);

  useEffect(() => {
    if (!accessToken) return;

    // DEBUG: Show all interviews in storage and the token being checked
    const interviews = JSON.parse(localStorage.getItem("interviews") || "{}");
    console.log("Current interviews in storage:", interviews);
    console.log("Checking access token:", accessToken);

    const interviewData = interviews[accessToken];
    console.log("Interview data for this token:", interviewData);

    if (!interviewData) {
      console.warn("No interview found for this token!");
      setValid(false);
    } else if (new Date(interviewData.expiresAt) < new Date()) {
      console.warn("Interview found, but link is expired!");
      setValid(false);
    } else {
      setInterview(interviewData);
      setValid(true);
    }
  }, [accessToken]);

  if (valid === false) return <AccessErrorPage />;
  if (valid === null) return <div className="text-center mt-24">Loading...</div>;

  // Success UI: Show interview details and start link
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg mx-auto text-center">
        <div className="text-green-600 text-3xl mb-4">✅</div>
        <h2 className="text-xl font-bold mb-2 text-gray-900">
          Interview Access Granted!
        </h2>
        <div className="mb-4 text-gray-700">
          <div>
            <strong>Candidate:</strong> {interview.candidateName}
          </div>
          <div>
            <strong>Position:</strong> {interview.position}
          </div>
          <div>
            <strong>Company:</strong> {interview.companyName}
          </div>
          <div>
            <strong>Expires At:</strong>{" "}
            {new Date(interview.expiresAt).toLocaleString()}
          </div>
        </div>
        <a
          href={`/avatar-interview?kb=${interview.knowledgeBaseId}`}
          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Start Interview
        </a>
      </div>
    </div>
  );
}
