"use client";
import { useState } from "react";

export default function CompetitiveJobPage() {
  const [currentJobDesc, setCurrentJobDesc] = useState("");
  const [compJobListings, setCompJobListings] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!currentJobDesc.trim()) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: { currentJobDesc, compJobListings }, type: "competitive-job" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">💼 AI Competitive Job Listing Analyzer</h1>
          <p className="text-gray-600 text-lg">Optimize your job descriptions to attract better candidates</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Current Job Description</label>
            <textarea
              className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
              rows={8}
              placeholder="Paste your current job description here..."
              value={currentJobDesc}
              onChange={(e) => setCurrentJobDesc(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Competing Job Listings (optional)</label>
            <textarea
              className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
              rows={6}
              placeholder="Paste competing job listings for similar roles (optional — helps identify gaps and opportunities)..."
              value={compJobListings}
              onChange={(e) => setCompJobListings(e.target.value)}
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !currentJobDesc.trim()}
            className="mt-4 w-full bg-cyan-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "🔄 Analyzing & Optimizing..." : "🚀 Optimize Job Listing"}
          </button>
          {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}
        </div>

        {result && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">✅ Optimized Job Listing</h2>
            <pre className="bg-gray-50 rounded-xl p-4 text-sm overflow-x-auto whitespace-pre-wrap text-gray-800">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
