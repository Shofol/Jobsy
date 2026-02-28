import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <span className="font-semibold text-amber-500">Resume Review</span>
          <nav className="flex gap-4">
            <Link
              href="/login"
              className="text-sm text-zinc-400 hover:text-zinc-200"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-medium text-zinc-950 hover:bg-amber-400"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
          Match your resume to the job
        </h1>
        <p className="mt-4 max-w-xl text-lg text-zinc-400">
          Upload your resume, paste a job description, and get AI-powered feedback:
          skill match, missing keywords, and tailored improvement suggestions.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-amber-500 px-6 py-3 font-medium text-zinc-950 hover:bg-amber-400"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-zinc-700 px-6 py-3 font-medium text-zinc-300 hover:bg-zinc-800"
          >
            Sign in
          </Link>
        </div>

        <ul className="mt-16 grid max-w-2xl gap-4 text-left text-sm text-zinc-400 sm:grid-cols-2">
          <li className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <span className="font-medium text-zinc-200">Resume vs JD analysis</span>
            <p className="mt-1">See match %, matching and missing skills, and what to learn.</p>
          </li>
          <li className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <span className="font-medium text-zinc-200">ATS-friendly suggestions</span>
            <p className="mt-1">Keywords and bullet-point improvements tailored to the role.</p>
          </li>
          <li className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <span className="font-medium text-zinc-200">Job & company insights</span>
            <p className="mt-1">Role summary, seniority, and AI-generated company context.</p>
          </li>
          <li className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <span className="font-medium text-zinc-200">Saved analyses</span>
            <p className="mt-1">Reuse results; no re-running for the same resume + JD pair.</p>
          </li>
        </ul>
      </main>
    </div>
  );
}
