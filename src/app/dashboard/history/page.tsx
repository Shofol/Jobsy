import Link from "next/link";
import { getAnalysesForUser } from "@/app/actions/analysis";

export default async function HistoryPage() {
  const analyses = await getAnalysesForUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-100">History</h1>
        <p className="text-sm text-zinc-400 mt-1">
          All your resume vs job description analyses.
        </p>
      </div>

      {analyses.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
          <p className="text-zinc-400">No analyses yet.</p>
          <Link
            href="/dashboard/new"
            className="mt-4 inline-block rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-amber-400"
          >
            Run your first analysis
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {analyses.map((a: {
            id: string;
            created_at: string;
            result_json: { jobSummary?: { roleTitle?: string }; matchAnalysis?: { matchPercent?: number } };
            resumes: { file_name: string | null } | null;
            job_descriptions: { content: string } | null;
          }) => (
            <li key={a.id}>
              <Link
                href={`/dashboard/history/${a.id}`}
                className="block rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-100 truncate">
                      {(a.result_json?.jobSummary as { roleTitle?: string })?.roleTitle ?? "Analysis"}
                    </p>
                    <p className="text-sm text-zinc-400 truncate">
                      {a.resumes?.file_name ?? "Resume"} · {(a.job_descriptions?.content ?? "").slice(0, 50)}…
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {typeof (a.result_json?.matchAnalysis as { matchPercent?: number })?.matchPercent === "number" && (
                      <span className="text-sm font-medium text-amber-400">
                        {(a.result_json.matchAnalysis as { matchPercent: number }).matchPercent}% match
                      </span>
                    )}
                    <span className="text-sm text-zinc-500">
                      {new Date(a.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
