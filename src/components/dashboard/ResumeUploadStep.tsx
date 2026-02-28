'use client';

import { useRef } from 'react';
import type { Resume } from '@/lib/types';

interface ResumeUploadStepProps {
  resumes: Resume[];
  uploadAction: (formData: FormData) => void;
  uploadState: { error?: string; resumeId?: string };
  onSelectResume: (id: string) => void;
  selectedResumeId: string | null;
  onContinue: () => void;
}

export function ResumeUploadStep({
  resumes,
  uploadAction,
  uploadState,
  onSelectResume,
  selectedResumeId,
  onContinue,
}: ResumeUploadStepProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 className="text-lg font-semibold text-zinc-100 mb-1">Upload your resume</h2>
      <p className="text-sm text-zinc-400 mb-6">
        PDF or DOCX, max 5MB. We extract text to analyze against job descriptions.
      </p>

      <form
        ref={formRef}
        action={uploadAction}
        className="mb-6"
      >
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-amber-500/50 transition-colors bg-zinc-900/50">
          <span className="text-sm text-zinc-400">Drop file here or click to upload</span>
          <span className="text-xs text-zinc-500 mt-1">PDF or DOCX</span>
          <input
            name="file"
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={() => formRef.current?.requestSubmit()}
          />
        </label>
        {uploadState.error && (
          <p className="mt-2 text-sm text-red-400">{uploadState.error}</p>
        )}
      </form>

      {resumes.length > 0 && (
        <>
          <h3 className="text-sm font-medium text-zinc-300 mb-2">Your resumes</h3>
          <ul className="space-y-2 mb-4">
            {resumes.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => onSelectResume(r.id)}
                  className={`w-full text-left rounded-lg border px-3 py-2 text-sm transition-colors ${
                    selectedResumeId === r.id
                      ? 'border-amber-500 bg-amber-500/10 text-amber-200'
                      : 'border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-zinc-600'
                  }`}
                >
                  {r.file_name || 'Resume'} · {new Date(r.created_at).toLocaleDateString()}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onContinue}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-amber-400"
          >
            Continue to job description
          </button>
        </>
      )}

      {resumes.length === 0 && (
        <p className="text-sm text-zinc-500">
          Upload a resume above to continue.
        </p>
      )}
    </section>
  );
}
