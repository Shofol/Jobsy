"use server";

import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import {
  buildAnalysisPrompt,
  parseAnalysisResponse,
  SYSTEM_PROMPT,
} from "@/lib/analysis-prompts";
import type { AnalysisResult } from "@/lib/types";
import { revalidatePath } from "next/cache";

const RATE_LIMIT_PER_DAY = parseInt(
  process.env.ANALYSIS_RATE_LIMIT_PER_DAY ?? "10",
  10,
);

export type RunAnalysisState = {
  error?: string;
  analysisId?: string;
  result?: AnalysisResult;
};

export async function runAnalysis(
  resumeId: string,
  jobDescriptionId: string,
): Promise<RunAnalysisState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be signed in." };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { error: "Analysis is not configured. Please set OPENAI_API_KEY." };
  }

  const resume = await supabase
    .from("resumes")
    .select("*")
    .eq("id", resumeId)
    .eq("user_id", user.id)
    .single();
  if (resume.error || !resume.data?.extracted_text) {
    return { error: "Resume not found or has no extracted text." };
  }

  const jd = await supabase
    .from("job_descriptions")
    .select("*")
    .eq("id", jobDescriptionId)
    .eq("user_id", user.id)
    .single();
  if (jd.error || !jd.data?.content) {
    return { error: "Job description not found." };
  }

  const since = new Date();
  since.setDate(since.getDate() - 1);
  const { count } = await supabase
    .from("analysis_usage")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", since.toISOString());

  if (count !== null && count >= RATE_LIMIT_PER_DAY) {
    return {
      error: `You've reached the daily analysis limit (${RATE_LIMIT_PER_DAY}). Try again tomorrow.`,
    };
  }

  const existing = await supabase
    .from("analyses")
    .select("id, result_json")
    .eq("resume_id", resumeId)
    .eq("job_description_id", jobDescriptionId)
    .single();

  if (existing.data) {
    revalidatePath("/dashboard");
    return {
      analysisId: existing.data.id,
      result: existing.data.result_json as AnalysisResult,
    };
  }

  const userPrompt = buildAnalysisPrompt(
    resume.data.extracted_text,
    jd.data.content,
  );

  let resultJson: AnalysisResult | null = null;
  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });
    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return { error: "Empty response from analysis service." };
    }
    resultJson = parseAnalysisResponse(content);
  } catch (e) {
    const err = e as { status?: number; message?: string };
    const message = (
      err?.message ?? (e instanceof Error ? e.message : "")
    ).toString();
    if (err?.status === 429 || /rate limit|too many request/i.test(message)) {
      return {
        error:
          "The AI is currently busy (rate limit). Please wait a moment and try again.",
      };
    }
    return { error: message || "Analysis failed." };
  }

  if (resultJson === null) {
    return { error: "Analysis failed. Please try again." };
  }

  await supabase.from("analysis_usage").insert({ user_id: user.id });

  const { data: analysis, error: insertError } = await supabase
    .from("analyses")
    .insert({
      user_id: user.id,
      resume_id: resumeId,
      job_description_id: jobDescriptionId,
      result_json: resultJson as unknown as Record<string, unknown>,
    })
    .select("id")
    .single();

  if (insertError) {
    return { error: "Failed to save analysis.", result: resultJson };
  }

  revalidatePath("/dashboard");
  return {
    analysisId: analysis.id,
    result: resultJson,
  };
}

export async function getAnalysis(
  resumeId: string,
  jobDescriptionId: string,
): Promise<AnalysisResult | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("analyses")
    .select("result_json")
    .eq("resume_id", resumeId)
    .eq("job_description_id", jobDescriptionId)
    .eq("user_id", user.id)
    .single();

  return (data?.result_json as AnalysisResult) ?? null;
}

export async function getAnalysesForUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("analyses")
    .select("*, resumes(*), job_descriptions(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAnalysisById(analysisId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("analyses")
    .select("*, resumes(*), job_descriptions(*)")
    .eq("id", analysisId)
    .eq("user_id", user.id)
    .single();
  return data;
}
