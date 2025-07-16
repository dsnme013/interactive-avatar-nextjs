import React, { useEffect, useState } from "react";
import {
  Shield,
  AlertCircle,
  Check,
  Calendar,
  Mail,
  Loader2,
  Home,
  RefreshCw,
} from "lucide-react";

// 1. Type for allowed error keys
type ErrorType = "invalid" | "expired" | "used";

// 2. Strongly-typed error message object
const errorMessages: Record<
  ErrorType,
  { title: string; description: string; icon: React.ReactNode }
> = {
  invalid: {
    title: "Invalid Interview Link",
    description: "This interview link is not valid or does not exist.",
    icon: <AlertCircle className="w-16 h-16 text-red-500" />,
  },
  expired: {
    title: "Interview Link Expired",
    description: "This interview link has expired and is no longer valid.",
    icon: <Calendar className="w-16 h-16 text-orange-500" />,
  },
  used: {
    title: "Link Already Used",
    description:
      "This interview link has already been used and cannot be accessed again.",
    icon: <Shield className="w-16 h-16 text-gray-500" />,
  },
};

// 3. Typed props for the component
function AccessErrorPage({ errorType = "invalid" }: { errorType?: ErrorType }) {
  const error = errorMessages[(errorType ?? "invalid") as ErrorType];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-center">
          <div className="mx-auto w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mb-4">
            {error.icon}
          </div>
          <h2 className="text-2xl font-bold text-white">{error.title}</h2>
        </div>

        <div className="p-8">
          <p className="text-gray-700 text-center mb-6">{error.description}</p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              What to do next:
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Check that you copied the entire link from your invitation
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Verify the link hasn't expired (check your email for expiration
                date)
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Contact the interview organizer for a new invitation
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Clear your browser cache and try again
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2 transition-colors"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <a
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
              href="/"
            >
              <Home className="w-4 h-4" />
              Go Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// >>> ADD THIS INTERFACE <<<
interface VerificationPageProps {
  interview: any; // you can replace 'any' with a more specific type if you have one
  onVerificationComplete: () => void;
}

function VerificationPage({
  interview,
  onVerificationComplete,
}: VerificationPageProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (email.toLowerCase() !== interview.candidateEmail.toLowerCase()) {
        setError("Email address does not match our records");
        setLoading(false);

        return;
      }
      if (interview.securitySettings.requireVerificationCode) {
        if (verificationCode.toUpperCase() !== interview.verificationCode) {
          setError("Invalid verification code");
          setLoading(false);

          return;
        }
      }
      const interviews = JSON.parse(localStorage.getItem("interviews") || "{}");

      interviews[interview.accessToken] = {
        ...interview,
        accessAttempts: (interview.accessAttempts || 0) + 1,
        lastAccessAt: new Date().toISOString(),
      };
      localStorage.setItem("interviews", JSON.stringify(interviews));
      onVerificationComplete();
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-center">
          <div className="mx-auto w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Verify Your Identity
          </h2>
          <p className="text-blue-100 mt-2">
            Please confirm your details to proceed
          </p>
        </div>

        <form className="p-8 space-y-4" onSubmit={handleVerification}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                required
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Use the email address from your invitation
            </p>
          </div>

          {interview.securitySettings.requireVerificationCode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-center text-lg uppercase"
                maxLength={6}
                placeholder="Enter 6-digit code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Check your email for the verification code
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            className={`w-full px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
              loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            disabled={loading}
            type="submit"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Verify & Continue
              </>
            )}
          </button>
        </form>

        <div className="bg-gray-50 px-8 py-4 border-t">
          <p className="text-xs text-gray-600 text-center">
            This verification helps ensure the security of your interview
            session
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SecureInterviewAccessPage({
  accessToken,
}: {
  accessToken: string;
}) {
  const [interview, setInterview] = useState<any>(null);
  const [valid, setValid] = useState<null | boolean>(null);
  const [verified, setVerified] = useState(false);
  const [errorType, setErrorType] = useState<ErrorType>("invalid");

  useEffect(() => {
    if (!accessToken) return;

    const interviews = JSON.parse(localStorage.getItem("interviews") || "{}");
    const interviewData = interviews[accessToken];

    if (!interviewData) {
      setErrorType("invalid");
      setValid(false);
    } else if (new Date(interviewData.expiresAt) < new Date()) {
      setErrorType("expired");
      setValid(false);
    } else if (
      !interviewData.securitySettings.allowMultipleAttempts &&
      interviewData.accessAttempts > 0
    ) {
      setErrorType("used");
      setValid(false);
    } else {
      setInterview(interviewData);
      setValid(true);
    }
  }, [accessToken]);

  if (valid === false) return <AccessErrorPage errorType={errorType} />;

  if (valid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading interview details...</p>
        </div>
      </div>
    );
  }

  // If requires authentication and not verified, show verification page
  if (interview.securitySettings.requireAuth && !verified) {
    return (
      <VerificationPage
        interview={interview}
        onVerificationComplete={() => setVerified(true)}
      />
    );
  }

  // Success UI: Show interview details and start link
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mb-4">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Interview Access Granted!
          </h2>
          <p className="text-green-100">Welcome, {interview.candidateName}</p>
        </div>

        <div className="p-8 space-y-6">
          {/* Interview Details */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              Interview Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Position:</span>
                <span className="font-medium text-gray-900">
                  {interview.position}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Company:</span>
                <span className="font-medium text-gray-900">
                  {interview.companyName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Meeting Code:</span>
                <span className="font-mono font-medium text-blue-600">
                  {interview.meetingCode}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Expires:</span>
                <span className="font-medium text-orange-600">
                  {new Date(interview.expiresAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Pre-Interview Checklist */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">
              Before You Start:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Test your camera and microphone
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Use Chrome, Firefox, or Safari browser
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Find a quiet, well-lit environment
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Have your resume ready for reference
              </li>
            </ul>
          </div>

          {/* Start Interview Button */}
          <a
            className="block w-full px-6 py-4 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg font-medium"
            href={`/avatar-interview?kb=${interview.knowledgeBaseId}`}
          >
            Start Interview Session
          </a>

          {/* Additional Info */}
          <p className="text-xs text-gray-500 text-center">
            By proceeding, you agree to the interview being recorded for
            evaluation purposes
          </p>
        </div>
      </div>
    </div>
  );
}
