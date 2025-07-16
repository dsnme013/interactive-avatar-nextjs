// 1. HR Setup Component (SecureInterviewPlatform.tsx)
import React, { useState } from "react";
import { useRouter } from "next/navigation";

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
  interviewLink?: string;
}

export default function SecureInterviewPlatform({
  onSetupComplete,
}: {
  onSetupComplete: (data: InterviewData) => void;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    candidateName: "",
    candidateEmail: "",
    companyName: "",
    position: "",
    jobDescription: "",
  });
  const [interviewLink, setInterviewLink] = useState("");
  const [loading, setLoading] = useState(false);

  const generateInterviewLink = async () => {
    setLoading(true);
    try {
      // Generate unique token
      const token =
        Math.random().toString(36).substring(2) + Date.now().toString(36);

      // Create knowledge base (you'll need to implement this API)
      const kbResponse = await fetch("/api/create-knowledge-base", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: formData.companyName,
          position: formData.position,
          jobDescription: formData.jobDescription,
        }),
      });

      const { knowledgeBaseId } = await kbResponse.json();

      // Save interview data (you'll need to implement this API)
      const saveResponse = await fetch("/api/save-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          token,
          knowledgeBaseId,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000,
          ).toISOString(), // 7 days
        }),
      });

      if (saveResponse.ok) {
        const baseUrl = window.location.origin;
        const link = `${baseUrl}/secure-interview/${token}`;
        setInterviewLink(link);

        // Send email to candidate (optional)
        await fetch("/api/send-interview-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            candidateEmail: formData.candidateEmail,
            candidateName: formData.candidateName,
            interviewLink: link,
            position: formData.position,
            companyName: formData.companyName,
          }),
        });
      }
    } catch (error) {
      console.error("Error creating interview:", error);
      alert("Failed to create interview link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Create Interview Session</h1>

      {!interviewLink ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            generateInterviewLink();
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Candidate Name
              </label>
              <input
                type="text"
                value={formData.candidateName}
                onChange={(e) =>
                  setFormData({ ...formData, candidateName: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Candidate Email
              </label>
              <input
                type="email"
                value={formData.candidateEmail}
                onChange={(e) =>
                  setFormData({ ...formData, candidateEmail: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Position</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Job Description
              </label>
              <textarea
                value={formData.jobDescription}
                onChange={(e) =>
                  setFormData({ ...formData, jobDescription: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                rows={4}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating Interview Link..." : "Generate Interview Link"}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">
              Interview Link Generated!
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Share this link with the candidate:
            </p>
            <div className="bg-white p-3 rounded border border-gray-300 break-all">
              <code className="text-sm">{interviewLink}</code>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(interviewLink)}
              className="mt-3 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Copy Link
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              ✓ Email sent to {formData.candidateEmail}
            </p>
          </div>

          <button
            onClick={() => {
              setInterviewLink("");
              setFormData({
                candidateName: "",
                candidateEmail: "",
                companyName: "",
                position: "",
                jobDescription: "",
              });
            }}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
          >
            Create Another Interview
          </button>
        </div>
      )}
    </div>
  );
}
