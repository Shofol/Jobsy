import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NewAnalysisClient } from "./NewAnalysisClient";
import { getResumes } from "@/app/actions/resume";
import { getJobDescriptions } from "@/app/actions/job-description";

export default async function NewAnalysisPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [resumes, jobDescriptions] = await Promise.all([
    getResumes(),
    getJobDescriptions(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-100">New analysis</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Paste a job description, pick a resume, and run the analysis.
        </p>
      </div>
      <NewAnalysisClient
        resumes={resumes}
        jobDescriptions={jobDescriptions}
      />
    </div>
  );
}
