import Link from "next/link";
import { notFound } from "next/navigation";
import { getAnalysisById } from "@/app/actions/analysis";
import { AnalysisResultView } from "@/components/dashboard/AnalysisResultView";
import type { AnalysisResult } from "@/lib/types";

export default async function HistoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const analysis = await getAnalysisById(id);
  if (!analysis?.result_json) notFound();

  const result = analysis.result_json as AnalysisResult;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/history"
          className="text-sm text-zinc-400 hover:text-zinc-200"
        >
          ← History
        </Link>
        <span className="text-zinc-600">·</span>
        <span className="text-sm text-zinc-500">
          {new Date(analysis.created_at).toLocaleDateString()}
        </span>
      </div>
      <AnalysisResultView
        result={result}
        backHref="/dashboard/history"
        newAnalysisHref="/dashboard/new"
      />
    </div>
  );
}
