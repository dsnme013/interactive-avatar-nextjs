// 2. Candidate Access Page (/app/secure-interview/[token]/page.tsx)
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const AvatarInterviewPage = dynamic(
  () => import('@/components/AvatarInterviewPage'),
  { ssr: false }
);

export default function CandidateInterviewPage() {
  const params = useParams();
  const router = useRouter();
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    validateAndLoadInterview();
  }, []);

  const validateAndLoadInterview = async () => {
    try {
      const response = await fetch(`/api/validate-interview/${params.token}`);
      
      if (!response.ok) {
        throw new Error('Invalid or expired interview link');
      }
      
      const data = await response.json();
      setInterviewData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Validating interview session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
          <p className="mt-4 text-gray-600">
            Please contact HR if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-xl font-semibold">
            Interview for {interviewData.position} at {interviewData.companyName}
          </h1>
          <p className="text-sm text-gray-600">Candidate: {interviewData.candidateName}</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AvatarInterviewPage 
          knowledgeBaseId={interviewData.knowledgeBaseId}
          interviewData={interviewData}
        />
      </div>
    </div>
  );
}