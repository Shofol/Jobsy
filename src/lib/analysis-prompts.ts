import type { AnalysisResult } from "./types";

export const SYSTEM_PROMPT = `You are an expert career coach and ATS (Applicant Tracking System) specialist. You analyze resumes against job descriptions and provide actionable, specific feedback. Be concise and structured. Keep in mind that the job seekers are trying to get a job, so the analysis should be helpful and actionable. Also, 
they will use to summarize the long job description into a summarized version. Job descriptions are often long and detailed, so you should be able to summarize them into a few sentences. Output valid JSON only.`;

export function buildAnalysisPrompt(
  resumeText: string,
  jobDescription: string,
): string {
  return `Analyze this resume against the given job description and return a single JSON object with the following structure. Use only the keys below; no extra keys. Use arrays for lists.

{
  "jobSummary": {
    "roleTitle": "string - job title",
    "seniorityLevel": "string - e.g. Senior, Mid-level, Entry",
    "location": "string - city/region if mentioned, else 'Not specified'",
    "workMode": "string - 'Remote' or 'On-site' or 'Hybrid' if clear from JD, else 'Not specified'",
    "employmentType": "string - 'Full-time' or 'Part-time' or 'Contract' or 'Contract-to-hire' or 'Temporary' or 'Internship' if clear, else 'Not specified'",
    "keyResponsibilities": ["string", "string"]
  },
  "matchAnalysis": {
    "matchPercent": number (0-100),
    "matchingSkills": ["skill1", "skill2"],
    "missingSkills": ["skill1", "skill2"],
    "suggestedSkillsToLearn": ["skill1", "skill2"]
  },
  "resumeSuggestions": {
    "bulletPointSuggestions": ["specific suggestion 1", "specific suggestion 2"],
    "keywordsForATS": ["keyword1", "keyword2"]
  },
  "companyInsights": {
    "overview": "string - brief company/role context inferred from JD",
    "industry": "string",
    "companySize": "string if mentioned, else 'Not specified'",
    "recentNews": ["string"] (empty if none inferrable),
    "sentimentSummary": "string - AI-generated summary of likely culture, WLB, compensation based on JD language",
    "disclaimer": "AI-generated insights based on job description only. Not from live data."
  },
  "nextSteps": ["actionable step 1", "actionable step 2", "actionable step 3"],
  "resultsDashboard": {
    "overallScore": number (0-100, overall resume vs JD fit for the color-coded ring),
    "sectionScores": { "summary": number 0-100 only if resume has summary, "experience": number, "skills": number, "education": number, "certifications": number if present, "projects": number if present },
    "atsScore": number (0-100, how well the resume will parse and match in typical ATS systems),
    "atsExplanation": "string - 1-3 sentences explaining what drives the ATS score and what to improve",
    "keywordMatches": ["keyword from JD that appears in resume"],
    "keywordGaps": ["important JD keyword missing or weak in resume"],
    "writingImprovements": [{ "before": "exact or paraphrased weak phrase from resume", "after": "improved version", "note": "optional brief reason" }],
    "formattingFeedback": ["specific formatting tip 1", "tip 2"],
    "topImprovements": ["top 3-5 prioritized improvements as short actionable items"]
  }
}

Resume (extracted text):
---
${resumeText.slice(0, 12000)}
---

Job description:
---
${jobDescription.slice(0, 8000)}
---

Return only the JSON object, no markdown or explanation.`;
}

export function parseAnalysisResponse(text: string): AnalysisResult {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  return JSON.parse(cleaned) as AnalysisResult;
}
