"use client";

import { useRef } from "react";
import Link from "next/link";
import { useActionState } from "react";
import { uploadResume } from "@/app/actions/resume";
import type { Resume } from "@/lib/types";

interface UploadCVClientProps {
  resumes: Resume[];
}

export function UploadCVClient({ resumes }: UploadCVClientProps) {
  const [uploadState, uploadAction] = useActionState(uploadResume, {});
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <form ref={formRef} action={uploadAction} className="space-y-4">
          <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-amber-500/50 transition-colors bg-zinc-900/50">
            <span className="text-sm text-zinc-400">
              Drop file here or click to upload
            </span>
            <span className="text-xs text-zinc-500 mt-1">PDF or DOCX, max 5MB</span>
            <input
              name="file"
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={() => formRef.current?.requestSubmit()}
            />
          </label>
          {uploadState.error && (
            <p className="text-sm text-red-400">{uploadState.error}</p>
          )}
          {uploadState.resumeId && (
            <p className="text-sm text-emerald-400">Resume uploaded successfully.</p>
          )}
        </form>
      </section>

      {resumes.length > 0 && (
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="text-lg font-semibold text-zinc-100 mb-3">
            Your resumes
          </h2>
          <ul className="space-y-2">
            {resumes.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-300"
              >
                {r.file_name || "Resume"} ·{" "}
                {new Date(r.created_at).toLocaleDateString()}
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard/new"
            className="mt-4 inline-block rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-amber-400"
          >
            Run new analysis
          </Link>
        </section>
      )}
    </div>
  );
}
