import { useState } from "react";

import InteractiveAvatarWrapper from "./InteractiveAvatar"; // Adjust import if needed

export default function AvatarInterviewPage({
  knowledgeBaseId,
}: {
  knowledgeBaseId: string;
}) {
  const [kbId, setKbId] = useState(knowledgeBaseId);
  const [showInterview, setShowInterview] = useState(false);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      {!showInterview ? (
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-lg space-y-4">
          <h2 className="text-xl font-bold mb-2 text-center text-gray-800">
            Avatar Interview
          </h2>
          <div>
            <label className="block font-semibold mb-2">
              Enter Knowledge Base ID:
            </label>
            <input
              className="w-full px-3 py-2 border rounded"
              placeholder="Paste or edit Knowledge Base ID"
              value={kbId}
              onChange={(e) => setKbId(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-600 w-full text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
            disabled={!kbId}
            onClick={() => setShowInterview(true)}
          >
            Start Interview Session
          </button>
        </div>
      ) : (
        <div className="w-full h-screen">
          <InteractiveAvatarWrapper knowledgeBaseId={kbId} />
        </div>
      )}
    </div>
  );
}
