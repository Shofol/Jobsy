# Architecture & decisions

## Stack

- **Next.js 14+ (App Router)** — Server Components by default, Server Actions for mutations, clear data flow.
- **Supabase** — Auth (email/password), Postgres (resumes, job_descriptions, analyses, rate-limit usage), Storage (private resume files).
- **Tailwind CSS** — Utility-first styling, dark-first theme for the dashboard.
- **Google Gemini API** — All analysis runs server-side (Server Actions); prompts and parsing live in `src/lib/analysis-prompts.ts`.

## Security & data

- **Auth**: Supabase Auth with cookie-based session; middleware refreshes session on each request (`@supabase/ssr`).
- **Protected routes**: Dashboard layout reads `getUser()` and redirects to `/login` if unauthenticated.
- **RLS**: Every table is protected by Row Level Security so users only see their own rows; storage bucket `resumes` is private with policies scoped by `auth.uid()` in the path.
- **Resume files**: Stored under `resumes/{user_id}/{timestamp}-resume.{pdf|docx}`; only the path is stored in DB. Signed URLs can be generated on demand if you add a “download” feature.
- **Secrets**: `GEMINI_API_KEY` and Supabase keys are env-only; never exposed to the client.

## Data flow

1. **Upload resume** — Server Action receives file, validates type/size, extracts text (PDF via `pdf-parse`, DOCX via `mammoth`), uploads to Supabase Storage, inserts row in `resumes` with `extracted_text`.
2. **Job description** — Server Action saves pasted content into `job_descriptions`.
3. **Analysis** — Server Action: checks rate limit (usage table, per user per day), optionally reuses existing analysis for same `(resume_id, job_description_id)`, calls Gemini with structured prompt, parses JSON, stores in `analyses.result_json`, increments usage.

## Rate limiting

- `analysis_usage` table records one row per analysis run per user. A daily cap (e.g. 10) is enforced in the analysis action by counting rows in the last 24 hours. Configurable via `ANALYSIS_RATE_LIMIT_PER_DAY`.

## UX choices

- **Step flow**: Resume → Job description → Analyze → Result. State is in React state; steps advance after successful upload/save. Existing resumes/JDs are selectable so users can re-run with different pairs.
- **Reuse**: Same resume + same JD returns cached analysis from `analyses` without calling Gemini again.
- **Empty states**: Each step explains what’s needed; “Continue” appears only when there’s at least one resume or JD.
- **Disclaimers**: Company insights and analysis result view include short disclaimers that content is AI-generated and for guidance only.

## File structure (high level)

- `src/app/` — App Router: `(auth)` for login/signup/check-email, `dashboard` for the app, `actions/` for auth/resume/job-description/analysis.
- `src/lib/` — Supabase client helpers, types, `parse-resume.ts`, `analysis-prompts.ts`.
- `src/components/dashboard/` — ResumeUploadStep, JobDescriptionStep, AnalysisStep, AnalysisResultView.
- `supabase/schema.sql` — Tables, indexes, RLS, storage bucket and policies.

## Scaling considerations

- **DB**: Indexes on `user_id` and `created_at` for resumes/job_descriptions/analyses; unique `(resume_id, job_description_id)` on analyses for idempotent reuse.
- **Gemini**: Model `gemini-2.0-flash` with `responseMimeType: application/json`; prompt truncates resume and JD to avoid token limits. For heavier docs, consider chunking or a separate “summarize resume” step.
- **Storage**: 5MB limit per file; allowed MIME types enforced in bucket config and in the upload action.
- **Concurrency**: No distributed lock; rate limit is a simple count. For strict fairness under high concurrency, consider a dedicated rate-limit service or Supabase Edge Function with atomic counters.
