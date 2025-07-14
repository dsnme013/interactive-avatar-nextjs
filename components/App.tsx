import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import SecureInterviewPlatform to prevent SSR issues
const SecureInterviewPlatform = dynamic(
  () => import('./SecureInterviewPlatform'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading Interview Setup...</div>
      </div>
    )
  }
);

// Dynamically import AvatarInterviewPage to prevent SSR issues
const AvatarInterviewPage = dynamic(
  () => import("./AvatarInterviewPage"),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading Interview System...</div>
      </div>
    )
  }
);

interface InterviewData {
  candidateName: string;
  candidateEmail: string;
  companyName: string;
  position: string;
  resumeLink: string;
  jobDescription: string;
  knowledgeBaseId: string;
  accessToken: string;
  verificationCode: string;
  securitySettings: any;
  createdAt: string;
  accessAttempts: number;
  isActive: boolean;
  expiresAt: string;
}

export default function App() {
  const [showAvatar, setShowAvatar] = useState(false);
  const [knowledgeBaseId, setKnowledgeBaseId] = useState<string>("");

  const handleSetupComplete = (data: InterviewData) => {
    // Store the knowledge base ID and go directly to avatar page
    setKnowledgeBaseId(data.knowledgeBaseId);
    setShowAvatar(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {!showAvatar ? (
        <SecureInterviewPlatform onSetupComplete={handleSetupComplete} />
      ) : (
        <AvatarInterviewPage knowledgeBaseId={knowledgeBaseId} />
      )}
    </div>
  );
}