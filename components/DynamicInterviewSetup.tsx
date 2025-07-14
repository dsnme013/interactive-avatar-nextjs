"use client";
import React, { useState } from "react";


// Place other imports here if needed
// (Only import things used in this file, not all avatar logic stuff!)
// import { Button } from "./Button";  // Uncomment if you have a custom Button component

export default function DynamicInterviewSetup({ onSetupComplete }) {
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
    const kbId = `KB-${Date.now()}-${form.position.replace(/\s+/g, '-').toLowerCase()}`;
    setForm({ ...form, knowledgeBaseId: kbId });
    alert(`Knowledge Base ID: ${kbId}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.knowledgeBaseId) {
      alert("Generate Knowledge Base ID first!");
      return;
    }
    // Send all form data to parent
    onSetupComplete(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md bg-white p-6 rounded-lg shadow mx-auto mt-12">
      <div className="text-2xl font-bold text-center mb-4">Setup New Interview</div>
      <input
        required
        placeholder="Candidate Name"
        value={form.candidateName}
        onChange={e => setForm({ ...form, candidateName: e.target.value })}
        className="input w-full px-3 py-2 border rounded"
      />
      <input
        required
        placeholder="Company Name"
        value={form.companyName}
        onChange={e => setForm({ ...form, companyName: e.target.value })}
        className="input w-full px-3 py-2 border rounded"
      />
      <input
        required
        placeholder="Position"
        value={form.position}
        onChange={e => setForm({ ...form, position: e.target.value })}
        className="input w-full px-3 py-2 border rounded"
      />
      <input
        required
        placeholder="Resume Link"
        value={form.resumeLink}
        onChange={e => setForm({ ...form, resumeLink: e.target.value })}
        className="input w-full px-3 py-2 border rounded"
      />
      <textarea
        required
        placeholder="Job Description (min 50 chars)"
        value={form.jobDescription}
        onChange={e => setForm({ ...form, jobDescription: e.target.value })}
        className="input w-full px-3 py-2 border rounded"
        minLength={50}
      />
      <button
        type="button"
        onClick={handleGenerateKB}
        className={`bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 w-full mb-2 ${(!form.position || !form.companyName || !form.jobDescription) ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={!form.position || !form.companyName || !form.jobDescription}
      >
        Generate Knowledge Base
      </button>
      {form.knowledgeBaseId && (
        <div className="text-xs text-green-600 font-mono mb-2">
          Knowledge Base ID: {form.knowledgeBaseId}
        </div>
      )}
      <button
        type="submit"
        disabled={!form.knowledgeBaseId}
        className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full ${!form.knowledgeBaseId ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        Start Interview
      </button>
    </form>
  );
}
