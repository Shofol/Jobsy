'use client';

import { useRef } from 'react';
import type { JobDescription } from '@/lib/types';

interface JobDescriptionStepProps {
  jobDescriptions: JobDescription[];
  jdAction: (formData: FormData) => void;
  jdState: { error?: string; jobDescriptionId?: string };
  selectedJdId: string | null;
  onSelectJd: (id: string) => void;
  onContinue: () => void;
}

export function JobDescriptionStep({
  jobDescriptions,
  jdAction,
  jdState,
  selectedJdId,
  onSelectJd,
  onContinue,
}: JobDescriptionStepProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 className="text-lg font-semibold text-zinc-100 mb-1">Paste job description</h2>
      <p className="text-sm text-zinc-400 mb-6">
        Copy the full job posting; we&apos;ll summarize it and match it to your resume.
      </p>

      <form ref={formRef} action={jdAction} className="mb-6">
        <textarea
          name="content"
          rows={8}
          placeholder="Paste the full job description here..."
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-y min-h-[160px]"
        />
        <button
          type="submit"
          className="mt-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-amber-400"
        >
          Save job description
        </button>
        {jdState.error && (
          <p className="mt-2 text-sm text-red-400">{jdState.error}</p>
        )}
      </form>

      {jobDescriptions.length > 0 && (
        <>
          <h3 className="text-sm font-medium text-zinc-300 mb-2">Saved job descriptions</h3>
          <ul className="space-y-2 mb-4">
            {jobDescriptions.map((jd) => (
              <li key={jd.id}>
                <button
                  type="button"
                  onClick={() => onSelectJd(jd.id)}
                  className={`w-full text-left rounded-lg border px-3 py-2 text-sm transition-colors truncate ${
                    selectedJdId === jd.id
                      ? 'border-amber-500 bg-amber-500/10 text-amber-200'
                      : 'border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-zinc-600'
                  }`}
                  title={jd.content.slice(0, 100)}
                >
                  {jd.content.slice(0, 60)}… · {new Date(jd.created_at).toLocaleDateString()}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onContinue}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-amber-400"
          >
            Continue to analysis
          </button>
        </>
      )}

      {jobDescriptions.length === 0 && (
        <p className="text-sm text-zinc-500">
          Paste and save a job description above to continue.
        </p>
      )}
    </section>
  );
}
