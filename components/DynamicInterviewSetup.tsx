"use client";
import React, { useState } from "react";

// Place other imports here if needed
// (Only import things used in this file, not all avatar logic stuff!)
// import { Button } from "./Button";  // Uncomment if you have a custom Button component

export default function DynamicInterviewSetup({
  onSetupComplete,
}: {
  onSetupComplete: (data: any) => void;
}) {
  const [form, setForm] = useState({
    candidateName: "",
    companyName: "",
    position: "",
    resumeLink: "",
    jobDescription: "",
    knowledgeBaseId: "",
  });

  // If you want to show a loading spinner
  const [loading, setLoading] = useState(false);

  const handleGenerateKB = () => {
    if (!form.position || !form.companyName || !form.jobDescription) {
      alert("Fill required fields.");

      return;
    }
    // You can customize the Knowledge Base ID format if needed
    const kbId = `KB-${Date.now()}-${form.position.replace(/\s+/g, "-").toLowerCase()}`;

    setForm({ ...form, knowledgeBaseId: kbId });
    alert(`Knowledge Base ID: ${kbId}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.knowledgeBaseId) {
      alert("Generate Knowledge Base ID first!");

      return;
    }
    // Send all form data to parent
    onSetupComplete(form);
  };

  return (
    <form
      className="space-y-4 w-full max-w-md bg-white p-6 rounded-lg shadow mx-auto mt-12"
      onSubmit={handleSubmit}
    >
      <div className="text-2xl font-bold text-center mb-4">
        Setup New Interview
      </div>
      <input
        required
        className="input w-full px-3 py-2 border rounded"
        placeholder="Candidate Name"
        value={form.candidateName}
        onChange={(e) => setForm({ ...form, candidateName: e.target.value })}
      />
      <input
        required
        className="input w-full px-3 py-2 border rounded"
        placeholder="Company Name"
        value={form.companyName}
        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
      />
      <input
        required
        className="input w-full px-3 py-2 border rounded"
        placeholder="Position"
        value={form.position}
        onChange={(e) => setForm({ ...form, position: e.target.value })}
      />
      <input
        required
        className="input w-full px-3 py-2 border rounded"
        placeholder="Resume Link"
        value={form.resumeLink}
        onChange={(e) => setForm({ ...form, resumeLink: e.target.value })}
      />
      <textarea
        required
        className="input w-full px-3 py-2 border rounded"
        minLength={50}
        placeholder="Job Description (min 50 chars)"
        value={form.jobDescription}
        onChange={(e) => setForm({ ...form, jobDescription: e.target.value })}
      />
      <button
        className={`bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 w-full mb-2 ${!form.position || !form.companyName || !form.jobDescription ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={!form.position || !form.companyName || !form.jobDescription}
        type="button"
        onClick={handleGenerateKB}
      >
        Generate Knowledge Base
      </button>
      {form.knowledgeBaseId && (
        <div className="text-xs text-green-600 font-mono mb-2">
          Knowledge Base ID: {form.knowledgeBaseId}
        </div>
      )}
      <button
        className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full ${!form.knowledgeBaseId ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={!form.knowledgeBaseId}
        type="submit"
      >
        Start Interview
      </button>
    </form>
  );
}
