# Resume Review

A production-ready SaaS MVP that lets users upload a resume, paste a job description, and get AI-powered analysis: skill match, missing keywords, resume suggestions, and company insights.

## Tech stack

- **Next.js 16** (App Router, TypeScript)
- **Supabase** (Auth, Postgres, Storage)
- **Tailwind CSS**
- **Google Gemini API** (server-side only)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the **SQL Editor**, run the contents of `supabase/schema.sql` to create tables, RLS, and storage policies.
3. **Storage bucket**: If the schema’s `INSERT INTO storage.buckets` doesn’t create the bucket (or uploads fail), create it manually:
   - Go to **Storage** in the dashboard → **New bucket**
   - Name: `resumes`
   - **Private** bucket
   - File size limit: 5 MB
   - Allowed MIME types: `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
   - Then run the storage policies from `supabase/schema.sql` (the three `CREATE POLICY` statements for `storage.objects`).
4. In **Authentication** → **URL Configuration**, set **Site URL** (e.g. `http://localhost:3000`) and add `http://localhost:3000/auth/callback` to **Redirect URLs**.

### 3. Environment variables

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

- `NEXT_PUBLIC_SUPABASE_URL` — Project URL from Supabase dashboard
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon public key
- `GEMINI_API_KEY` — Google Gemini API key for analysis (get one at [aistudio.google.com/apikey](https://aistudio.google.com/apikey))
- Optional: `ANALYSIS_RATE_LIMIT_PER_DAY` (default `10`), `NEXT_PUBLIC_SITE_URL` for auth redirects

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up, upload a resume (PDF or DOCX), paste a job description, and run analysis.

## Project structure

| Path | Purpose |
|------|--------|
| `src/app/` | App Router: `(auth)` (login/signup), `dashboard`, Server Actions in `actions/` |
| `src/lib/` | Supabase clients, types, `parse-resume.ts`, `analysis-prompts.ts` |
| `src/components/` | Auth forms, dashboard steps and analysis result UI |
| `supabase/schema.sql` | Tables, RLS, storage bucket and policies |

See **ARCHITECTURE.md** for design decisions, data flow, and scaling notes.

## Features

- **Auth**: Email/password signup and login; protected dashboard; session via cookies.
- **Resume upload**: PDF/DOCX, max 5MB; text extracted server-side; stored in Supabase Storage and DB.
- **Job description**: Paste and save; stored in `job_descriptions`.
- **AI analysis**: Job summary, resume vs JD match (%, matching/missing/suggested skills), resume improvement suggestions (bullets + ATS keywords), company insights (AI-generated, with disclaimer), next steps. Results cached in DB per (resume, JD) pair; rate-limited per user per day.
- **Dashboard**: Step flow (Resume → Job description → Analyze → Result), empty states, and disclaimers for AI content.

## License

MIT
