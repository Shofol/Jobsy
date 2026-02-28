'use client';

import { useState } from 'react';
import { useActionState, useEffect } from 'react';
import { uploadResume } from '@/app/actions/resume';
import { createJobDescription } from '@/app/actions/job-description';
import { runAnalysis } from '@/app/actions/analysis';
import type { Resume, JobDescription } from '@/lib/types';
import type { AnalysisResult } from '@/lib/types';
import { ResumeUploadStep } from '@/components/dashboard/ResumeUploadStep';
import { JobDescriptionStep } from '@/components/dashboard/JobDescriptionStep';
import { AnalysisStep } from '@/components/dashboard/AnalysisStep';
import { AnalysisResultView } from '@/components/dashboard/AnalysisResultView';

type Step = 'resume' | 'jd' | 'analyze' | 'result';

interface DashboardClientProps {
  resumes: Resume[];
  jobDescriptions: JobDescription[];
}

export function DashboardClient({
  resumes,
  jobDescriptions,
}: DashboardClientProps) {
  const [step, setStep] = useState<Step>(
    resumes.length === 0 ? 'resume' : jobDescriptions.length === 0 ? 'jd' : 'analyze'
  );
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(
    resumes[0]?.id ?? null
  );
  const [selectedJdId, setSelectedJdId] = useState<string | null>(
    jobDescriptions[0]?.id ?? null
  );
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [uploadState, uploadAction] = useActionState(uploadResume, {});
  const [jdState, jdAction] = useActionState(createJobDescription, {});

  useEffect(() => {
    if (uploadState.resumeId) {
      setSelectedResumeId(uploadState.resumeId);
      setStep('jd');
    }
  }, [uploadState.resumeId]);

  useEffect(() => {
    if (jdState.jobDescriptionId) {
      setSelectedJdId(jdState.jobDescriptionId);
      setStep('analyze');
    }
  }, [jdState.jobDescriptionId]);

  async function handleRunAnalysis() {
    if (!selectedResumeId || !selectedJdId) return;
    setAnalysisError(null);
    setAnalysisResult(null);
    const state = await runAnalysis(selectedResumeId, selectedJdId);
    if (state.error) {
      setAnalysisError(state.error);
      return;
    }
    if (state.result) {
      setAnalysisResult(state.result);
      setStep('result');
    }
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <StepIndicator
          label="1. Resume"
          active={step === 'resume'}
          done={resumes.length > 0}
        />
        <span className="text-zinc-600">→</span>
        <StepIndicator
          label="2. Job description"
          active={step === 'jd'}
          done={jobDescriptions.length > 0}
        />
        <span className="text-zinc-600">→</span>
        <StepIndicator
          label="3. Analyze"
          active={step === 'analyze' || step === 'result'}
          done={!!analysisResult}
        />
      </div>

      {step === 'resume' && (
        <ResumeUploadStep
          resumes={resumes}
          uploadAction={uploadAction}
          uploadState={uploadState}
          onSelectResume={setSelectedResumeId}
          selectedResumeId={selectedResumeId}
          onContinue={() => setStep('jd')}
        />
      )}

      {step === 'jd' && (
        <JobDescriptionStep
          jobDescriptions={jobDescriptions}
          jdAction={jdAction}
          jdState={jdState}
          selectedJdId={selectedJdId}
          onSelectJd={setSelectedJdId}
          onContinue={() => setStep('analyze')}
        />
      )}

      {step === 'analyze' && (
        <AnalysisStep
          resumes={resumes}
          jobDescriptions={jobDescriptions}
          selectedResumeId={selectedResumeId}
          selectedJdId={selectedJdId}
          onSelectResume={setSelectedResumeId}
          onSelectJd={setSelectedJdId}
          onRunAnalysis={handleRunAnalysis}
          analysisError={analysisError}
        />
      )}

      {step === 'result' && analysisResult && (
        <AnalysisResultView
          result={analysisResult}
          onBack={() => setStep('analyze')}
          onNewAnalysis={() => {
            setAnalysisResult(null);
            setStep('analyze');
          }}
        />
      )}
    </div>
  );
}

function StepIndicator({
  label,
  active,
  done,
}: {
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <span
      className={
        active
          ? 'text-amber-500 font-medium'
          : done
            ? 'text-zinc-500'
            : 'text-zinc-600'
      }
    >
      {label}
    </span>
  );
}
