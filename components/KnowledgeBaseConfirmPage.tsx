import React from "react";
// Define prop types
interface KnowledgeBaseConfirmPageProps {
  kbId: string; // Assuming kbId is a string, adjust if it's another type.
  onProceed: () => void; // Assuming onProceed is a function that takes no arguments and returns void.
  onBack: () => void; // Assuming onBack is a function that takes no arguments and returns void.
}

export default function KnowledgeBaseConfirmPage({
  kbId,
  onProceed,
  onBack,
}: KnowledgeBaseConfirmPageProps) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white rounded shadow-lg p-8 max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Knowledge Base Ready</h2>
        <div className="mb-2 text-gray-800">
          <strong>Knowledge Base ID:</strong>
          <div className="font-mono break-all text-blue-700">{kbId}</div>
        </div>
        <button
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={onProceed}
        >
          Start Interview
        </button>
        <button onClick={onProceed}>Start Interview</button>

        <button
          className="mt-4 text-gray-400 hover:text-gray-700 block"
          onClick={onBack}
        >
          ← Back to Setup
        </button>
      </div>
    </div>
  );
}
