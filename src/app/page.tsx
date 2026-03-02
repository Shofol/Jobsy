import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-amber-500"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Jobsy
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-zinc-950 hover:bg-amber-400 transition-colors"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-4 pt-16 pb-24 sm:px-8 sm:pt-28 sm:pb-40">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_70%_-30%,rgba(245,158,11,0.18),transparent_50%)]" />
          <div className="absolute top-20 right-0 w-[min(90vw,520px)] h-[320px] sm:h-[420px] opacity-30 sm:opacity-40 pointer-events-none" aria-hidden>
            <HeroIllustration />
          </div>
          <div className="relative mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p
                className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90 mb-4 sm:mb-6"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                AI-powered resume fit
              </p>
              <h1
                className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                Land more interviews.
              </h1>
              <p className="mt-6 sm:mt-8 text-base sm:text-xl text-zinc-400 leading-relaxed max-w-lg">
                Upload your resume, paste any job description, and get an
                instant fit score, keyword gaps, and tailored
                improvements—before you hit submit.
              </p>
              <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
                <Link
                  href="/signup"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3.5 sm:px-8 sm:py-4 text-base font-bold text-zinc-950 hover:bg-amber-400 transition-all shadow-[0_0_40px_rgba(245,158,11,0.25)] touch-manipulation"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  Get started free
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border-2 border-zinc-600 px-6 py-3.5 sm:px-8 sm:py-4 text-base font-semibold text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800/50 transition-colors touch-manipulation"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-zinc-800/80 px-4 py-16 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <p
              className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              How it works
            </p>
            <h2
              className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl max-w-2xl"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Three steps to a stronger application.
            </h2>
            <div className="mt-12 sm:mt-20 grid gap-8 sm:gap-12 sm:grid-cols-3">
              <div className="group relative">
                <div className="rounded-2xl border-2 border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 transition-colors group-hover:border-amber-500/40">
                  <div className="mb-6">
                    <StepIllustrationUpload />
                  </div>
                  <span
                    className="text-4xl font-extrabold text-amber-500/20"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    01
                  </span>
                  <h3
                    className="mt-2 text-xl font-bold text-white"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    Upload your resume
                  </h3>
                  <p className="mt-3 text-zinc-400 leading-relaxed">
                    PDF or DOCX. We extract the text and keep it private.
                  </p>
                </div>
              </div>
              <div className="group relative">
                <div className="rounded-2xl border-2 border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 transition-colors group-hover:border-amber-500/40">
                  <div className="mb-6">
                    <StepIllustrationPaste />
                  </div>
                  <span
                    className="text-4xl font-extrabold text-amber-500/20"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    02
                  </span>
                  <h3
                    className="mt-2 text-xl font-bold text-white"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    Paste the job description
                  </h3>
                  <p className="mt-3 text-zinc-400 leading-relaxed">
                    Any role. We summarize location, work mode, and key
                    requirements.
                  </p>
                </div>
              </div>
              <div className="group relative">
                <div className="rounded-2xl border-2 border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 transition-colors group-hover:border-amber-500/40">
                  <div className="mb-6">
                    <StepIllustrationAnalyze />
                  </div>
                  <span
                    className="text-4xl font-extrabold text-amber-500/20"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    03
                  </span>
                  <h3
                    className="mt-2 text-xl font-bold text-white"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    Get your analysis
                  </h3>
                  <p className="mt-3 text-zinc-400 leading-relaxed">
                    Fit score, ATS score, keyword gaps, and before/after writing
                    tips.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-zinc-800/80 px-4 py-16 sm:px-8 sm:py-32 bg-zinc-900/20">
          <div className="mx-auto max-w-6xl">
            <p
              className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              What you get
            </p>
            <h2
              className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl max-w-2xl"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Everything you need to stand out.
            </h2>
            <ul className="mt-10 sm:mt-16 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Overall & section scores",
                  desc: "Color-coded fit score plus per-section breakdown (experience, skills, education).",
                  Icon: FeatureScore,
                },
                {
                  title: "ATS score & explanation",
                  desc: "See how well your resume will parse in typical ATS systems and what to fix.",
                  Icon: FeatureATS,
                },
                {
                  title: "Keyword matches vs gaps",
                  desc: "Two-column view: what the JD wants that you have, and what you're missing.",
                  Icon: FeatureKeywords,
                },
                {
                  title: "Writing improvements",
                  desc: "Before/after bullet suggestions so you can copy-paste stronger phrasing.",
                  Icon: FeatureWriting,
                },
                {
                  title: "Job summary",
                  desc: "Role, seniority, location, remote/hybrid/on-site, full-time vs contract—at a glance.",
                  Icon: FeatureJob,
                },
                {
                  title: "History & reuse",
                  desc: "All analyses saved. Revisit any resume + JD pair without re-running.",
                  Icon: FeatureHistory,
                },
              ].map(({ title, desc, Icon }) => (
                <li
                  key={title}
                  className="flex flex-col sm:flex-row gap-4 sm:gap-5 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 sm:p-6 items-start"
                >
                  <div className="shrink-0 rounded-xl bg-amber-500/10 p-3">
                    <Icon />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-bold text-white"
                      style={{ fontFamily: "var(--font-syne)" }}
                    >
                      {title}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-zinc-800/80 px-4 py-16 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h2
              className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Ready to strengthen your next application?
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-zinc-400">
              Sign up in seconds. No credit card required.
            </p>
            <div className="mt-8 sm:mt-10">
              <Link
                href="/signup"
                className="inline-flex rounded-full bg-amber-500 px-8 py-3.5 sm:px-10 sm:py-4 text-base sm:text-lg font-bold text-zinc-950 hover:bg-amber-400 transition-colors touch-manipulation"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                Get started free
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-zinc-800 px-4 py-10 sm:px-8">
          <div className="mx-auto max-w-6xl flex flex-col items-center justify-between gap-4 sm:flex-row">
            <span className="text-sm text-zinc-500">
              © {new Date().getFullYear()} Jobsy. AI-generated insights—use as a
              guide only.
            </span>
            <nav className="flex gap-8 text-sm font-medium text-zinc-400">
              <Link
                href="/login"
                className="hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="hover:text-white transition-colors"
              >
                Sign up
              </Link>
            </nav>
          </div>
        </footer>
      </main>
    </div>
  );
}

function HeroIllustration() {
  return (
    <svg viewBox="0 0 520 420" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id="hero-grad1" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f59e0b" stopOpacity="0.4" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hero-grad2" x1="0%" y1="100%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f59e0b" stopOpacity="0.25" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M80 80 L80 320 L280 320 L320 280 L320 80 Z" stroke="url(#hero-grad1)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M280 320 L280 280 L320 280 Z" fill="url(#hero-grad1)" fillOpacity="0.3" />
      <line x1="100" y1="110" x2="220" y2="110" stroke="url(#hero-grad2)" strokeWidth="1.5" opacity="0.6" />
      <line x1="100" y1="140" x2="260" y2="140" stroke="url(#hero-grad2)" strokeWidth="1.5" opacity="0.5" />
      <line x1="100" y1="170" x2="200" y2="170" stroke="url(#hero-grad2)" strokeWidth="1.5" opacity="0.4" />
      <circle cx="380" cy="200" r="80" stroke="url(#hero-grad2)" strokeWidth="3" fill="none" strokeDasharray="200 402" strokeLinecap="round" />
      <circle cx="380" cy="200" r="60" stroke="url(#hero-grad1)" strokeWidth="2" fill="none" opacity="0.5" />
      <text x="380" y="208" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="28" fontWeight="bold" fontFamily="system-ui">87</text>
      <rect x="340" y="60" width="60" height="8" rx="4" fill="url(#hero-grad2)" fillOpacity="0.5" />
      <rect x="400" y="320" width="80" height="8" rx="4" fill="url(#hero-grad2)" fillOpacity="0.4" />
    </svg>
  );
}

function StepIllustrationUpload() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className="w-14 h-14 text-amber-500/90"
    >
      <rect
        x="12"
        y="8"
        width="40"
        height="48"
        rx="4"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M24 24 L32 32 L40 24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 32 L32 44"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StepIllustrationPaste() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className="w-14 h-14 text-amber-500/90"
    >
      <rect
        x="10"
        y="14"
        width="36"
        height="40"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <line
        x1="16"
        y1="24"
        x2="40"
        y2="24"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="16"
        y1="32"
        x2="36"
        y2="32"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="16"
        y1="40"
        x2="32"
        y2="40"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="28"
        y="4"
        width="20"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.15"
      />
    </svg>
  );
}

function StepIllustrationAnalyze() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className="w-14 h-14 text-amber-500/90"
    >
      <circle
        cx="32"
        cy="32"
        r="22"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeDasharray="60 120"
      />
      <path
        d="M32 10 L32 32 L48 38"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="32" r="3" fill="currentColor" />
    </svg>
  );
}

function FeatureScore() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6 text-amber-500">
      <circle
        cx="16"
        cy="16"
        r="12"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeDasharray="24 48"
      />
      <text
        x="16"
        y="18"
        textAnchor="middle"
        fill="currentColor"
        fontSize="10"
        fontWeight="bold"
      >
        %
      </text>
    </svg>
  );
}

function FeatureATS() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6 text-amber-500">
      <rect
        x="6"
        y="4"
        width="20"
        height="24"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M10 10 L22 10 M10 16 L18 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FeatureKeywords() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6 text-amber-500">
      <ellipse
        cx="10"
        cy="16"
        rx="6"
        ry="4"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <ellipse
        cx="22"
        cy="16"
        rx="6"
        ry="4"
        stroke="currentColor"
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.2"
      />
    </svg>
  );
}

function FeatureWriting() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6 text-amber-500">
      <path
        d="M8 22 L12 10 L14 18 L16 8 L18 18 L20 10 L24 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FeatureJob() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6 text-amber-500">
      <rect
        x="4"
        y="8"
        width="24"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path d="M4 14 L28 14" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function FeatureHistory() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6 text-amber-500">
      <circle
        cx="16"
        cy="16"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M16 10 L16 16 L20 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
