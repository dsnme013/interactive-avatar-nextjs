import React, { useState, useEffect } from 'react';
import { Mail, Lock, Calendar, AlertCircle, Check, Copy, Send, Shield, Eye, EyeOff, Link2 } from 'lucide-react';

// Secure Interview Setup Component
function SecureInterviewSetup({ onSetupComplete }) {
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

  const [loading, setLoading] = useState(false);
  const [securitySettings, setSecuritySettings] = useState({
    requireAuth: true,
    linkExpiration: 7, // Changed from 10000 to 7 days
    allowMultipleAttempts: false,
    requireVerificationCode: true,
  });

  const generateSecureToken = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleGenerateKB = () => {
    if (!form.position || !form.companyName || !form.jobDescription) {
      alert("Fill required fields.");
      return;
    }
    
    const kbId = `KB-${Date.now()}-${form.position.replace(/\s+/g, '-').toLowerCase()}`;
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + securitySettings.linkExpiration);
    
    setForm({ 
      ...form, 
      knowledgeBaseId: kbId,
      expiresAt: expirationDate.toISOString()
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
    
    // Generate secure access token
    const accessToken = generateSecureToken();
    const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const secureInterviewData = {
      ...form,
      accessToken,
      verificationCode,
      securitySettings,
      createdAt: new Date().toISOString(),
      accessAttempts: 0,
      isActive: true,
    };
    
    // Store in localStorage instead of mockDatabase
    const existingInterviews = JSON.parse(localStorage.getItem('interviews') || '{}');
    existingInterviews[accessToken] = secureInterviewData;
    localStorage.setItem('interviews', JSON.stringify(existingInterviews));
    
    console.log('Interview saved with token:', accessToken);
    console.log('All interviews:', existingInterviews);
    
    onSetupComplete(secureInterviewData);
  };

  return (
    <div className="space-y-6 w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg mx-auto mt-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Setup Secure Interview</h2>
        <p className="text-gray-600">Create a protected interview session with email verification</p>
      </div>

      {/* Enhanced Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
        <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Enhanced Security Features</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Email verification required for access</li>
            <li>Unique access tokens (not predictable URLs)</li>
            <li>Time-based expiration</li>
            <li>Access attempt monitoring</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        {/* Candidate Information */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Candidate Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Candidate Name *
              </label>
              <input
                required
                placeholder="John Doe"
                value={form.candidateName}
                onChange={e => setForm({ ...form, candidateName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Candidate Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  required
                  type="email"
                  placeholder="john.doe@example.com"
                  value={form.candidateEmail}
                  onChange={e => setForm({ ...form, candidateEmail: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                A verification code will be sent to this email
              </p>
            </div>
          </div>
        </div>

        {/* Position Information */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Position Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name *
              </label>
              <input
                required
                placeholder="Acme Corporation"
                value={form.companyName}
                onChange={e => setForm({ ...form, companyName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position Title *
              </label>
              <input
                required
                placeholder="Senior Software Engineer"
                value={form.position}
                onChange={e => setForm({ ...form, position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resume Link
            </label>
            <input
              placeholder="https://example.com/resume.pdf"
              value={form.resumeLink}
              onChange={e => setForm({ ...form, resumeLink: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Job Description */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
          <textarea
            required
            placeholder="Provide a detailed job description (minimum 50 characters)..."
            value={form.jobDescription}
            onChange={e => setForm({ ...form, jobDescription: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
            minLength={50}
          />
          <p className="text-xs text-gray-500 mt-1">
            {form.jobDescription.length}/50 characters minimum
          </p>
        </div>

        {/* Enhanced Security Settings */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Security Settings</h3>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={securitySettings.requireAuth}
                onChange={e => setSecuritySettings({ ...securitySettings, requireAuth: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Require email verification to access interview
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={securitySettings.requireVerificationCode}
                onChange={e => setSecuritySettings({ ...securitySettings, requireVerificationCode: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Require verification code (sent via email)
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={securitySettings.allowMultipleAttempts}
                onChange={e => setSecuritySettings({ ...securitySettings, allowMultipleAttempts: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Allow multiple access attempts (if unchecked, link becomes invalid after first use)
              </span>
            </label>
            
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <label className="text-sm text-gray-700">Link expires after:</label>
              <select
                value={securitySettings.linkExpiration}
                onChange={e => setSecuritySettings({ ...securitySettings, linkExpiration: parseInt(e.target.value) })}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={1}>1 day</option>
                <option value={3}>3 days</option>
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGenerateKB}
            className={`w-full bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium ${
              (!form.position || !form.companyName || !form.jobDescription) ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!form.position || !form.companyName || !form.jobDescription}
          >
            Generate Knowledge Base
          </button>
          
          {form.knowledgeBaseId && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <p className="text-sm text-green-800">
                <span className="font-semibold">Knowledge Base ID:</span> {form.knowledgeBaseId}
              </p>
              {form.expiresAt && (
                <p className="text-xs text-green-600 mt-1">
                  Link will expire on: {new Date(form.expiresAt).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
          
          <button
            onClick={handleSubmit}
            disabled={!form.knowledgeBaseId || (securitySettings.requireAuth && !form.candidateEmail)}
            className={`w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium ${
              (!form.knowledgeBaseId || (securitySettings.requireAuth && !form.candidateEmail)) ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Create Secure Interview Link
          </button>
        </div>
      </div>
    </div>
  );
}

// Secure Interview Success Page
function SecureInterviewSuccessPage({ formData, onCreateAnother }) {
  const [showToken, setShowToken] = useState(false);
  const [linkType, setLinkType] = useState('secure');
  
  const secureLink = `${window.location.origin}/secure-interview/${formData.accessToken}`;
  const kbLink = `${window.location.origin}/interview/${formData.knowledgeBaseId}`;
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  };

  const copyVerificationCode = () => {
    navigator.clipboard.writeText(formData.verificationCode);
    alert('Verification code copied to clipboard!');
  };

  const emailCandidate = () => {
    const subject = `Secure Interview Invitation - ${formData.position}`;
    const body = `Dear ${formData.candidateName},

You have been invited to participate in a secure interview for the ${formData.position} position at ${formData.companyName}.

Please follow these steps to access your interview:

1. Click this secure link: ${secureLink}
2. Verify your email address: ${formData.candidateEmail}
3. Enter verification code: ${formData.verificationCode}

Important Security Information:
- This link is personalized for you and expires on ${new Date(formData.expiresAt).toLocaleDateString()}
- You must use the exact email address above to access the interview
- The verification code is required for security purposes
- Do not share this link or verification code with anyone

Best regards,
${formData.companyName} Hiring Team`;

    window.open(`mailto:${formData.candidateEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Secure Interview Created!</h2>
          <p className="text-gray-600 mt-2">Protected interview link for {formData.candidateName}</p>
        </div>

        {/* Security Features Display */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-900 mb-2">Security Features Enabled:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Email verification required</li>
            <li>✓ Unique access token (not guessable)</li>
            <li>✓ Time-based expiration</li>
            {formData.securitySettings.requireVerificationCode && <li>✓ Verification code required</li>}
            {!formData.securitySettings.allowMultipleAttempts && <li>✓ Single-use link</li>}
          </ul>
        </div>

        {/* Link Display */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Secure Interview Link
          </label>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={secureLink}
              readOnly
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white font-mono text-sm"
            />
            <button
              onClick={() => copyToClipboard(secureLink)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
          </div>
        </div>

        {/* Verification Code */}
        {formData.securitySettings.requireVerificationCode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-yellow-900">Verification Code</h4>
                <p className="text-sm text-yellow-800">Share this code with the candidate</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold text-yellow-900">
                  {formData.verificationCode}
                </span>
                <button
                  onClick={copyVerificationCode}
                  className="p-2 text-yellow-600 hover:text-yellow-800"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Candidate Information */}
        <div className="border rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">Interview Details</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Candidate:</strong> {formData.candidateName}</p>
            <p><strong>Email:</strong> {formData.candidateEmail}</p>
            <p><strong>Position:</strong> {formData.position}</p>
            <p><strong>Company:</strong> {formData.companyName}</p>
            <p><strong>Expires:</strong> {new Date(formData.expiresAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={emailCandidate}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send Secure Email
          </button>
          <button
            onClick={onCreateAnother}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Create Another
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Platform Component
export default function SecureInterviewPlatform() {
  const [currentView, setCurrentView] = useState('setup');
  const [interviewData, setInterviewData] = useState(null);

  const handleSetupComplete = (formData) => {
    setInterviewData(formData);
    setCurrentView('success');
  };

  const handleCreateAnother = () => {
    setInterviewData(null);
    setCurrentView('setup');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {currentView === 'setup' && (
        <SecureInterviewSetup onSetupComplete={handleSetupComplete} />
      )}
      {currentView === 'success' && (
        <SecureInterviewSuccessPage 
          formData={interviewData} 
          onCreateAnother={handleCreateAnother} 
        />
      )}
    </div>
  );
}