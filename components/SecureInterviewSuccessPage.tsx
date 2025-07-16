// components/SecureInterviewSuccessPage.tsx

import React from "react";

interface SecureInterviewSuccessPageProps {
  formData: any;
  onCreateAnother: () => void;
}

const SecureInterviewSuccessPage = ({
  formData,
  onCreateAnother,
}: SecureInterviewSuccessPageProps) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            {/* Example success icon */}
            <span className="w-8 h-8 text-green-600">✔</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Secure Interview Created!
          </h2>
          <p className="text-gray-600 mt-2">
            Protected interview link for {formData.candidateName}
          </p>
        </div>

        <button
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          onClick={onCreateAnother}
        >
          Create Another Interview
        </button>
      </div>
    </div>
  );
};

export default SecureInterviewSuccessPage;
