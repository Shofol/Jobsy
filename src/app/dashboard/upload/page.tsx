import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UploadCVClient } from "./UploadCVClient";
import { getResumes } from "@/app/actions/resume";

export default async function UploadCVPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const resumes = await getResumes();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-100">Upload CV</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Add a new resume (PDF or DOCX). We extract text to analyze against job
          descriptions.
        </p>
      </div>
      <UploadCVClient resumes={resumes} />
    </div>
  );
}
