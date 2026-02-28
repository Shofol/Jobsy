'use client';

import { useState } from 'react';
import type { Resume, JobDescription } from '@/lib/types';

interface AnalysisStepProps {
  resumes: Resume[];
  jobDescriptions: JobDescription[];
  selectedResumeId: string | null;
  selectedJdId: string | null;
  onSelectResume: (id: string) => void;
  onSelectJd: (id: string) => void;
  onRunAnalysis: () => Promise<void>;
  analysisError: string | null;
}

export function AnalysisStep({
  resumes,
  jobDescriptions,
  selectedResumeId,
  selectedJdId,
  onSelectResume,
  onSelectJd,
  onRunAnalysis,
  analysisError,
}: AnalysisStepProps) {
  const [loading, setLoading] = useState(false);

  async function handleRun() {
    setLoading(true);
    try {
      await onRunAnalysis();
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 className="text-lg font-semibold text-zinc-100 mb-1">Run analysis</h2>
      <p className="text-sm text-zinc-400 mb-6">
        We&apos;ll compare your resume to the job description and suggest improvements.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 mb-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Resume</label>
          <select
            value={selectedResumeId ?? ''}
            onChange={(e) => onSelectResume(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none"
          >
            <option value="">Select...</option>
            {resumes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.file_name || 'Resume'} · {new Date(r.created_at).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Job description</label>
          <select
            value={selectedJdId ?? ''}
            onChange={(e) => onSelectJd(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none"
          >
            <option value="">Select...</option>
            {jobDescriptions.map((jd) => (
              <option key={jd.id} value={jd.id}>
                {jd.content.slice(0, 40)}… · {new Date(jd.created_at).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {analysisError && (
        <p className="mb-4 text-sm text-red-400">{analysisError}</p>
      )}

      <button
        type="button"
        onClick={handleRun}
        disabled={!selectedResumeId || !selectedJdId || loading}
        className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-medium text-zinc-950 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Analyzing…' : 'Analyze resume vs job'}
      </button>
    </section>
  );
}
