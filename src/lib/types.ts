export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Resume {
  id: string;
  user_id: string;
  file_url: string;
  file_name: string | null;
  extracted_text: string | null;
  created_at: string;
}

export interface JobDescription {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface Analysis {
  id: string;
  user_id: string;
  resume_id: string;
  job_description_id: string;
  result_json: AnalysisResult;
  created_at: string;
}

/** Section scores (0-100) for resume sections. Include only sections present in the resume. */
export interface SectionScores {
  summary?: number;
  experience?: number;
  skills?: number;
  education?: number;
  certifications?: number;
  projects?: number;
  [key: string]: number | undefined;
}

/** One writing improvement as a before/after pair. */
export interface WritingImprovement {
  before: string;
  after: string;
  note?: string;
}

/** Extended results for the results dashboard (overall score, sections, ATS, keywords, writing, formatting). */
export interface ResultsDashboard {
  /** Overall fit score 0-100 for the color-coded ring. */
  overallScore?: number;
  /** Per-section scores 0-100 (summary, experience, skills, education, etc.). */
  sectionScores?: SectionScores;
  /** ATS compatibility score 0-100. */
  atsScore?: number;
  /** Brief explanation of what the ATS score means and what affects it. */
  atsExplanation?: string;
  /** Keywords from the JD that appear in the resume (for two-column view). */
  keywordMatches?: string[];
  /** Keywords from the JD that are missing or weak in the resume. */
  keywordGaps?: string[];
  /** Writing improvements as before/after pairs. */
  writingImprovements?: WritingImprovement[];
  /** Formatting feedback (structure, spacing, headings, etc.). */
  formattingFeedback?: string[];
  /** Top 3-5 improvements to prioritize. */
  topImprovements?: string[];
}

export interface AnalysisResult {
  jobSummary?: JobSummary;
  matchAnalysis?: MatchAnalysis;
  resumeSuggestions?: ResumeSuggestions;
  companyInsights?: CompanyInsights;
  nextSteps?: string[];
  /** Enhanced results dashboard (scores, ATS, keywords, writing, formatting). */
  resultsDashboard?: ResultsDashboard;
}

export interface JobSummary {
  roleTitle: string;
  seniorityLevel: string;
  /** Location (city, region, or "Not specified") */
  location?: string;
  /** Work mode: "Remote", "On-site", "Hybrid", or "Not specified" */
  workMode?: string;
  /** Employment type: "Full-time", "Part-time", "Contract", "Contract-to-hire", "Temporary", "Internship", or "Not specified" */
  employmentType?: string;
  keyResponsibilities: string[];
}

export interface MatchAnalysis {
  matchPercent: number;
  matchingSkills: string[];
  missingSkills: string[];
  suggestedSkillsToLearn: string[];
}

export interface ResumeSuggestions {
  bulletPointSuggestions: string[];
  keywordsForATS: string[];
}

export interface CompanyInsights {
  overview: string;
  industry: string;
  companySize: string;
  recentNews: string[];
  sentimentSummary: string;
  disclaimer?: string;
}
