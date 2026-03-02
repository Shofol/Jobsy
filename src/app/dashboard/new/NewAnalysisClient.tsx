"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { createJobDescription } from "@/app/actions/job-description";
import { runAnalysis } from "@/app/actions/analysis";
import type { Resume, JobDescription } from "@/lib/types";
import { AnalysisResultView } from "@/components/dashboard/AnalysisResultView";
import type { AnalysisResult } from "@/lib/types";

interface NewAnalysisClientProps {
  resumes: Resume[];
  jobDescriptions: JobDescription[];
}

export function NewAnalysisClient({
  resumes,
  jobDescriptions,
}: NewAnalysisClientProps) {
  const router = useRouter();
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(
    resumes[0]?.id ?? null
  );
  const [selectedJdId, setSelectedJdId] = useState<string | null>(
    jobDescriptions[0]?.id ?? null
  );
  const [useNewJd, setUseNewJd] = useState(jobDescriptions.length === 0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [jdState, jdAction] = useActionState(createJobDescription, {});
  const formRef = useRef<HTMLFormElement>(null);

  async function handleRunAnalysis() {
    let jdId = selectedJdId;
    if (useNewJd && formRef.current) {
      const formData = new FormData(formRef.current);
      const content = formData.get("content") as string | null;
      if (!content?.trim()) {
        setAnalysisError("Paste a job description first.");
        return;
      }
      setLoading(true);
      setAnalysisError(null);
      const state = await createJobDescription({}, formData);
      if (state.error) {
        setAnalysisError(state.error);
        setLoading(false);
        return;
      }
      if (state.jobDescriptionId) jdId = state.jobDescriptionId;
    }

    if (!selectedResumeId || !jdId) {
      setAnalysisError("Select a resume and a job description.");
      setLoading(false);
      return;
    }

    setAnalysisError(null);
    const state = await runAnalysis(selectedResumeId, jdId);
    setLoading(false);
    if (state.error) {
      setAnalysisError(state.error);
      return;
    }
    if (state.result) {
      setAnalysisResult(state.result);
      if (state.analysisId) {
        router.refresh();
      }
    }
  }

  if (analysisResult) {
    return (
      <AnalysisResultView
        result={analysisResult}
        onBack={() => setAnalysisResult(null)}
        onNewAnalysis={() => {
          setAnalysisResult(null);
          setSelectedJdId(jobDescriptions[0]?.id ?? null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {resumes.length === 0 ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200 text-sm">
          You need at least one resume.{" "}
          <a href="/dashboard/upload" className="underline">
            Upload a CV
          </a>{" "}
          first.
        </div>
      ) : (
        <>
          <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-100 mb-4">
              Job description
            </h2>
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => setUseNewJd(true)}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  useNewJd
                    ? "bg-amber-500 text-zinc-950"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Paste new
              </button>
              <button
                type="button"
                onClick={() => setUseNewJd(false)}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  !useNewJd
                    ? "bg-amber-500 text-zinc-950"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Use saved
              </button>
            </div>

            {useNewJd ? (
              <form ref={formRef} action={jdAction} className="space-y-3">
                <textarea
                  name="content"
                  rows={8}
                  placeholder="Paste the full job description here..."
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-y min-h-[160px]"
                />
                {jdState.error && (
                  <p className="text-sm text-red-400">{jdState.error}</p>
                )}
              </form>
            ) : (
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Saved job descriptions
                </label>
                <select
                  value={selectedJdId ?? ""}
                  onChange={(e) => setSelectedJdId(e.target.value || null)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-3 sm:py-2 text-zinc-100 focus:border-amber-500 focus:outline-none text-base min-h-[44px] touch-manipulation"
                >
                  <option value="">Select...</option>
                  {jobDescriptions.map((jd) => (
                    <option key={jd.id} value={jd.id}>
                      {jd.content.slice(0, 60)}… ·{" "}
                      {new Date(jd.created_at).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-100 mb-4">
              Resume
            </h2>
            <select
              value={selectedResumeId ?? ""}
              onChange={(e) => setSelectedResumeId(e.target.value || null)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-3 sm:py-2 text-zinc-100 focus:border-amber-500 focus:outline-none text-base min-h-[44px] touch-manipulation"
            >
              <option value="">Select...</option>
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.file_name || "Resume"} ·{" "}
                  {new Date(r.created_at).toLocaleDateString()}
                </option>
              ))}
            </select>
          </section>

          {analysisError && (
            <p className="text-sm text-red-400">{analysisError}</p>
          )}

          <button
            type="button"
            onClick={handleRunAnalysis}
            disabled={loading}
            className="w-full sm:w-auto rounded-lg bg-amber-500 px-6 py-3.5 sm:py-2.5 text-sm font-medium text-zinc-950 hover:bg-amber-400 disabled:opacity-50 min-h-[44px] touch-manipulation"
          >
            {loading ? "Saving & analyzing…" : "Run analysis"}
          </button>
        </>
      )}
    </div>
  );
}
