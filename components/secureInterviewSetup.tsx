// components/SecureInterviewSetup.tsx
import React, { useState } from "react";

// Secure Interview Setup Component
interface SecureInterviewSetupProps {
  onSetupComplete: (formData: any) => void; // Explicitly type `onSetupComplete` parameter
}

const SecureInterviewSetup = ({
  onSetupComplete,
}: SecureInterviewSetupProps) => {
  const [form, setForm] = useState({
    candidateName: "",
    candidateEmail: "",
    companyName: "",
    position: "",
    resumeLink: "",
    jobDescription: "",
    knowledgeBaseId: "",
    expiresAt: "",
  });

  const [securitySettings, setSecuritySettings] = useState({
    requireAuth: true,
    linkExpiration: 7,
    allowMultipleAttempts: false,
    requireVerificationCode: true,
  });

  const generateSecureToken = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const handleGenerateKB = () => {
    if (!form.position || !form.companyName || !form.jobDescription) {
      alert("Fill required fields.");

      return;
    }

    const kbId = `KB-${Date.now()}-${form.position.replace(/\s+/g, "-").toLowerCase()}`;
    const expirationDate = new Date();

    expirationDate.setDate(
      expirationDate.getDate() + securitySettings.linkExpiration,
    );

    setForm({
      ...form,
      knowledgeBaseId: kbId,
      expiresAt: expirationDate.toISOString(),
    });

    alert(`Knowledge Base ID: ${kbId}`);
  };

  const handleSubmit = () => {
    if (!form.knowledgeBaseId) {
      alert("Generate Knowledge Base ID first!");

      return;
    }

    if (securitySettings.requireAuth && !form.candidateEmail) {
      alert("Candidate email is required for secure interviews!");

      return;
    }

    const accessToken = generateSecureToken();
    const verificationCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    // Generate the interview meeting link
    const meetingLink = {
      code: `MEET-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      fullUrl: `${window.location.origin}/meet/${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    };

    const secureInterviewData = {
      ...form,
      accessToken,
      verificationCode,
      meetingCode: meetingLink.code,
      meetingUrl: meetingLink.fullUrl,
      securitySettings,
      createdAt: new Date().toISOString(),
      accessAttempts: 0,
      isActive: true,
    };

    const existingInterviews = JSON.parse(
      localStorage.getItem("interviews") || "{}",
    );

    existingInterviews[accessToken] = secureInterviewData;
    existingInterviews[`meet-${meetingLink.code}`] = secureInterviewData;
    localStorage.setItem("interviews", JSON.stringify(existingInterviews));

    console.log("Interview saved with token:", accessToken);
    console.log("Meeting code:", meetingLink.code);

    onSetupComplete(secureInterviewData);
  };

  return (
    <div className="space-y-6 w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg mx-auto mt-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Setup Secure Interview
        </h2>
        <p className="text-gray-600">
          Create a protected interview session with email verification
        </p>
      </div>

      <div className="space-y-4">
        {/* Candidate Information */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Candidate Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Candidate Name *
              </label>
              <input
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
                value={form.candidateName}
                onChange={(e) =>
                  setForm({ ...form, candidateName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Candidate Email *
              </label>
              <input
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="john.doe@example.com"
                type="email"
                value={form.candidateEmail}
                onChange={(e) =>
                  setForm({ ...form, candidateEmail: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            className={`w-full bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium ${
              !form.position || !form.companyName || !form.jobDescription
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={
              !form.position || !form.companyName || !form.jobDescription
            }
            onClick={handleGenerateKB}
          >
            Generate Knowledge Base
          </button>

          {form.knowledgeBaseId && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <p className="text-sm text-green-800">
                <span className="font-semibold">Knowledge Base ID:</span>{" "}
                {form.knowledgeBaseId}
              </p>
              {form.expiresAt && (
                <p className="text-xs text-green-600 mt-1">
                  Link will expire on:{" "}
                  {new Date(form.expiresAt).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          <button
            className={`w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium ${
              !form.knowledgeBaseId ||
              (securitySettings.requireAuth && !form.candidateEmail)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={
              !form.knowledgeBaseId ||
              (securitySettings.requireAuth && !form.candidateEmail)
            }
            onClick={handleSubmit}
          >
            Create Secure Interview Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecureInterviewSetup;
