// app/secure-interview/[token]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Shield, AlertCircle } from "lucide-react";

// Dynamically import AvatarInterviewPage
const AvatarInterviewPage = dynamic(
  () => import("../../../components/AvatarInterviewPage"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading Interview System...</div>
      </div>
    ),
  },
);

// Mock database - should match the one in SecureInterviewPlatform
const mockDatabase = {
  interviews: new Map(),
  accessTokens: new Map(),
  verificationCodes: new Map(),
};

export default function SecureInterviewPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [verificationStep, setVerificationStep] = useState("email"); // 'email' | 'code' | 'verified'
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [interviewData, setInterviewData] = useState<any>(null);

  // In a real app, this would fetch from your backend
  const validateToken = () => {
    // For demo purposes, we'll check if the token exists
    // In production, this should validate against your backend
    const interview = mockDatabase.interviews.get(token);

    if (!interview) {
      setError("Invalid or expired interview link");

      return false;
    }

    // Check if link has expired
    if (new Date(interview.expiresAt) < new Date()) {
      setError("This interview link has expired");

      return false;
    }

    setInterviewData(interview);

    return true;
  };

  useEffect(() => {
    if (!validateToken()) {
      // Optionally redirect to an error page
      setTimeout(() => router.push("/"), 3000);
    }
  }, [token]);

  const handleEmailVerification = (e: React.FormEvent) => {
    e.preventDefault();

    // In production, verify email against the interview data
    if (
      interviewData &&
      email.toLowerCase() === interviewData.candidateEmail.toLowerCase()
    ) {
      if (interviewData.securitySettings.requireVerificationCode) {
        setVerificationStep("code");
      } else {
        setVerificationStep("verified");
      }
      setError("");
    } else {
      setError("Email address does not match our records");
    }
  };

  const handleCodeVerification = (e: React.FormEvent) => {
    e.preventDefault();

    if (verificationCode.toUpperCase() === interviewData.verificationCode) {
      setVerificationStep("verified");
      setError("");
    } else {
      setError("Invalid verification code");
    }
  };

  if (error && !interviewData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to homepage...</p>
        </div>
      </div>
    );
  }

  if (verificationStep === "verified" && interviewData) {
    return (
      <AvatarInterviewPage knowledgeBaseId={interviewData.knowledgeBaseId} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <Shield className="w-8 h-8 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">
            Secure Interview Access
          </h1>
        </div>

        {interviewData && (
          <div className="mb-6 text-center">
            <p className="text-gray-600">
              Interview for:{" "}
              <span className="font-semibold">{interviewData.position}</span>
            </p>
            <p className="text-gray-600">
              at{" "}
              <span className="font-semibold">{interviewData.companyName}</span>
            </p>
          </div>
        )}

        {verificationStep === "email" && (
          <form className="space-y-4" onSubmit={handleEmailVerification}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verify Your Email Address
              </label>
              <input
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              type="submit"
            >
              Verify Email
            </button>
          </form>
        )}

        {verificationStep === "code" && (
          <form className="space-y-4" onSubmit={handleCodeVerification}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter Verification Code
              </label>
              <input
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase font-mono text-center text-lg"
                maxLength={6}
                placeholder="Enter 6-character code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Check your email for the verification code
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              type="submit"
            >
              Verify Code
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
