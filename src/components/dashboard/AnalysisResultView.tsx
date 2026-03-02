'use client';

import Link from 'next/link';
import type { AnalysisResult, WritingImprovement } from '@/lib/types';

interface AnalysisResultViewProps {
  result: AnalysisResult;
  onBack?: () => void;
  onNewAnalysis?: () => void;
  backHref?: string;
  newAnalysisHref?: string;
}

function scoreRingColor(score: number): string {
  if (score >= 75) return 'text-emerald-400';
  if (score >= 50) return 'text-amber-400';
  return 'text-red-400';
}

function scoreRingStroke(score: number): string {
  if (score >= 75) return 'stroke-emerald-500';
  if (score >= 50) return 'stroke-amber-500';
  return 'stroke-red-500';
}

function scoreBarColor(score: number): string {
  if (score >= 75) return 'bg-emerald-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-red-500';
}

const SECTION_LABELS: Record<string, string> = {
  summary: 'Summary',
  experience: 'Experience',
  skills: 'Skills',
  education: 'Education',
  certifications: 'Certifications',
  projects: 'Projects',
};

export function AnalysisResultView({
  result,
  onBack,
  onNewAnalysis,
  backHref,
  newAnalysisHref,
}: AnalysisResultViewProps) {
  const job = result.jobSummary;
  const match = result.matchAnalysis;
  const suggestions = result.resumeSuggestions;
  const company = result.companyInsights;
  const nextSteps = result.nextSteps ?? [];
  const dashboard = result.resultsDashboard;

  return (
    <div className="space-y-4 min-w-0 overflow-hidden">
      <div className="flex flex-wrap items-center gap-2">
        {backHref ? (
          <Link href={backHref} className="text-sm text-zinc-400 hover:text-zinc-200 py-2 touch-manipulation">
            ← Back
          </Link>
        ) : (
          <button type="button" onClick={onBack} className="text-sm text-zinc-400 hover:text-zinc-200 py-2 touch-manipulation">
            ← Back
          </button>
        )}
        {newAnalysisHref ? (
          <Link href={newAnalysisHref} className="rounded-lg border border-zinc-700 px-3 py-2.5 sm:py-1.5 text-sm text-zinc-300 hover:bg-zinc-800 touch-manipulation min-h-[44px] sm:min-h-0 inline-flex items-center">
            New analysis
          </Link>
        ) : (
          <button type="button" onClick={onNewAnalysis} className="rounded-lg border border-zinc-700 px-3 py-2.5 sm:py-1.5 text-sm text-zinc-300 hover:bg-zinc-800 touch-manipulation min-h-[44px] sm:min-h-0">
            New analysis
          </button>
        )}
      </div>

      {/* Job summary first */}
      {job && (
        <Section title="Job summary">
          <div className="grid gap-1.5 sm:grid-cols-2 text-sm">
            <div>
              <span className="text-zinc-500 text-xs">Role</span>
              <p className="font-medium text-zinc-100">{job.roleTitle}</p>
            </div>
            <div>
              <span className="text-zinc-500 text-xs">Seniority</span>
              <p className="font-medium text-zinc-100">{job.seniorityLevel}</p>
            </div>
            {job.location && (
              <div>
                <span className="text-zinc-500 text-xs">Location</span>
                <p className="font-medium text-zinc-100">{job.location}</p>
              </div>
            )}
            {job.workMode && (
              <div>
                <span className="text-zinc-500 text-xs">Work mode</span>
                <p className="font-medium text-zinc-100">{job.workMode}</p>
              </div>
            )}
            {job.employmentType && (
              <div>
                <span className="text-zinc-500 text-xs">Employment type</span>
                <p className="font-medium text-zinc-100">{job.employmentType}</p>
              </div>
            )}
          </div>
          {job.keyResponsibilities?.length > 0 && (
            <div className="mt-2">
              <span className="text-zinc-500 text-xs">Key responsibilities</span>
              <ul className="mt-0.5 list-disc list-inside text-zinc-300 text-sm space-y-0.5">
                {job.keyResponsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </Section>
      )}

      {match && (
        <Section title="Resume vs job match">
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-0.5">
              <span className="text-zinc-400">Skills match</span>
              <span className="font-medium text-amber-400">{match.matchPercent}%</span>
            </div>
            <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-500"
                style={{ width: `${Math.min(100, match.matchPercent)}%` }}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">
            {match.matchingSkills?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {(match.matchingSkills as string[]).map((s, i) => (
                  <span key={i} className="rounded-full bg-emerald-500/20 text-emerald-300 px-2 py-0.5">{s}</span>
                ))}
              </div>
            )}
            {match.missingSkills?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {(match.missingSkills as string[]).map((s, i) => (
                  <span key={i} className="rounded-full bg-amber-500/20 text-amber-300 px-2 py-0.5">{s}</span>
                ))}
              </div>
            )}
            {match.suggestedSkillsToLearn?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {(match.suggestedSkillsToLearn as string[]).map((s, i) => (
                  <span key={i} className="rounded-full bg-zinc-700 text-zinc-300 px-2 py-0.5">{s}</span>
                ))}
              </div>
            )}
          </div>
        </Section>
      )}

      {suggestions && (
        <Section title="Resume improvement suggestions">
          {suggestions.bulletPointSuggestions?.length > 0 && (
            <ul className="list-disc list-inside text-zinc-300 text-sm space-y-0.5 mb-2">
              {suggestions.bulletPointSuggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          )}
          {suggestions.keywordsForATS?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {suggestions.keywordsForATS.map((k, i) => (
                <span key={i} className="rounded bg-zinc-700 px-1.5 py-0.5 text-xs text-zinc-200 font-mono">{k}</span>
              ))}
            </div>
          )}
        </Section>
      )}

      {company && (
        <Section title="Company insights">
          <p className="text-xs text-amber-600/90 mb-2">{company.disclaimer ?? 'AI-generated insights based on job description only.'}</p>
          <div className="grid gap-2 sm:grid-cols-2 text-sm">
            {company.overview && <div><span className="text-zinc-500 text-xs">Overview</span><p className="text-zinc-300 text-sm mt-0.5">{company.overview}</p></div>}
            {company.industry && <div><span className="text-zinc-500 text-xs">Industry</span><p className="text-zinc-300 text-sm mt-0.5">{company.industry}</p></div>}
            {company.companySize && <div><span className="text-zinc-500 text-xs">Size</span><p className="text-zinc-300 text-sm mt-0.5">{company.companySize}</p></div>}
          </div>
          {company.sentimentSummary && (
            <p className="text-zinc-300 text-sm mt-2">{company.sentimentSummary}</p>
          )}
          {company.recentNews?.length > 0 && (
            <ul className="mt-1 list-disc list-inside text-zinc-300 text-sm">
              {company.recentNews.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          )}
        </Section>
      )}

      {nextSteps.length > 0 && (
        <Section title="Next steps">
          <ul className="space-y-1">
            {nextSteps.map((step, i) => (
              <li key={i} className="flex gap-2 rounded border border-zinc-700 bg-zinc-800/50 px-2 py-1.5 text-sm text-zinc-200">
                <span className="text-amber-500 font-medium shrink-0">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Results dashboard at bottom — compact */}
      {dashboard && (
        <Section title="Results dashboard">
          <div className="space-y-4">
            {typeof dashboard.overallScore === 'number' && (
              <div className="flex flex-col items-center gap-1">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="10" className="text-zinc-800" />
                    <circle
                      cx="60" cy="60" r="52" fill="none" strokeWidth="10" strokeLinecap="round"
                      strokeDasharray={`${(dashboard.overallScore / 100) * 327} 327`}
                      className={scoreRingStroke(dashboard.overallScore)}
                    />
                  </svg>
                  <span className={`absolute inset-0 flex items-center justify-center text-xl font-bold ${scoreRingColor(dashboard.overallScore)}`}>
                    {Math.round(dashboard.overallScore)}
                  </span>
                </div>
                <p className="text-xs text-zinc-500">Overall fit</p>
              </div>
            )}

            {dashboard.sectionScores && Object.keys(dashboard.sectionScores).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-zinc-400">Section scores</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  {(Object.entries(dashboard.sectionScores) as [string, number][]).filter(([, v]) => typeof v === 'number').map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-zinc-500">{SECTION_LABELS[key] ?? key}</span>
                        <span className="text-zinc-300">{Math.round(value)}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                        <div className={`h-full rounded-full ${scoreBarColor(value)}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(typeof dashboard.atsScore === 'number' || dashboard.atsExplanation) && (
              <div className="rounded border border-zinc-700 bg-zinc-800/50 p-2.5 space-y-1">
                <h4 className="text-xs font-medium text-zinc-400">ATS score</h4>
                {typeof dashboard.atsScore === 'number' && (
                  <span className={`text-lg font-bold ${scoreRingColor(dashboard.atsScore)}`}>{Math.round(dashboard.atsScore)}%</span>
                )}
                {dashboard.atsExplanation && <p className="text-xs text-zinc-400">{dashboard.atsExplanation}</p>}
              </div>
            )}

            {((dashboard.keywordMatches?.length ?? 0) > 0 || (dashboard.keywordGaps?.length ?? 0) > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="rounded border border-zinc-700 bg-zinc-800/30 p-2">
                  <h4 className="text-xs font-medium text-emerald-400 mb-1">Keyword matches</h4>
                  <div className="flex flex-wrap gap-1 min-w-0">
                    {(dashboard.keywordMatches ?? []).map((k, i) => (
                      <span key={i} className="rounded-full bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 text-xs break-all">{k}</span>
                    ))}
                  </div>
                </div>
                <div className="rounded border border-zinc-700 bg-zinc-800/30 p-2">
                  <h4 className="text-xs font-medium text-amber-400 mb-1">Keyword gaps</h4>
                  <div className="flex flex-wrap gap-1">
                    {(dashboard.keywordGaps ?? []).map((k, i) => (
                      <span key={i} className="rounded-full bg-amber-500/20 text-amber-300 px-1.5 py-0.5 text-xs break-all">{k}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {(dashboard.writingImprovements?.length ?? 0) > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-zinc-400">Writing improvements</h4>
                <ul className="space-y-2">
                  {dashboard.writingImprovements!.map((item: WritingImprovement, i: number) => (
                    <li key={i} className="rounded border border-zinc-700 bg-zinc-800/30 p-2 space-y-1">
                      <div><span className="text-[10px] text-zinc-500 uppercase">Before</span><p className="text-xs text-zinc-400 line-through">{item.before}</p></div>
                      <div><span className="text-[10px] text-zinc-500 uppercase">After</span><p className="text-xs text-zinc-200">{item.after}</p></div>
                      {item.note && <p className="text-[10px] text-zinc-500">{item.note}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-2">
              {(dashboard.formattingFeedback?.length ?? 0) > 0 && (
                <div className="rounded border border-zinc-700 bg-zinc-800/30 p-2">
                  <h4 className="text-xs font-medium text-zinc-400 mb-1">Formatting</h4>
                  <ul className="list-disc list-inside text-xs text-zinc-400 space-y-0.5">
                    {dashboard.formattingFeedback!.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
              {(dashboard.topImprovements?.length ?? 0) > 0 && (
                <div className="rounded border border-amber-500/30 bg-amber-500/10 p-2">
                  <h4 className="text-xs font-medium text-amber-400 mb-1">Top improvements</h4>
                  <ol className="list-decimal list-inside text-xs text-zinc-200 space-y-0.5">
                    {dashboard.topImprovements!.map((imp, i) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </Section>
      )}

      <div className="pt-2 border-t border-zinc-800">
        <p className="text-[10px] text-zinc-500">AI-generated. Use as a guide only.</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
      <h3 className="text-sm font-semibold text-zinc-100 mb-3">{title}</h3>
      {children}
    </div>
  );
}
