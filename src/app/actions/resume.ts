'use server';

import { createClient } from '@/lib/supabase/server';
import { extractTextFromBuffer } from '@/lib/parse-resume';
import { revalidatePath } from 'next/cache';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export type UploadResumeState = {
  error?: string;
  resumeId?: string;
};

export async function uploadResume(
  _prev: UploadResumeState,
  formData: FormData
): Promise<UploadResumeState> {
  const file = formData.get('file') as File | null;
  if (!file || file.size === 0) {
    return { error: 'Please select a PDF or DOCX file.' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { error: 'File must be under 5MB.' };
  }

  const mimeType = file.type;
  if (!ALLOWED_TYPES.includes(mimeType)) {
    return { error: 'Only PDF and DOCX files are allowed.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'You must be signed in to upload a resume.' };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  let extractedText: string;
  try {
    extractedText = await extractTextFromBuffer(buffer, mimeType);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Could not extract text from this file.';
    return {
      error: message.includes('Unsupported') ? message : `Could not extract text. ${message}`,
    };
  }

  const ext = mimeType === 'application/pdf' ? 'pdf' : 'docx';
  const fileName = `${user.id}/${Date.now()}-resume.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('resumes')
    .upload(fileName, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (uploadError) {
    const msg = uploadError.message || 'Storage upload failed.';
    return {
      error: msg.includes('Bucket not found') || msg.includes('not found')
        ? 'Storage bucket "resumes" not found. Create a private bucket named "resumes" in Supabase Dashboard → Storage, with 5MB limit and allowed types: PDF, DOCX.'
        : msg.includes('row-level security') || msg.includes('policy')
          ? 'Upload denied by storage policy. Ensure the "resumes" bucket has a policy allowing users to upload to a folder named with their user ID.'
          : `Upload failed: ${msg}`,
    };
  }

  const { data: resume, error: insertError } = await supabase
    .from('resumes')
    .insert({
      user_id: user.id,
      file_url: fileName,
      file_name: file.name,
      extracted_text: extractedText || null,
    })
    .select('id')
    .single();

  if (insertError) {
    return {
      error: insertError.message?.includes('relation') || insertError.message?.includes('does not exist')
        ? 'Database table "resumes" missing. Run the SQL in supabase/schema.sql in your Supabase project.'
        : `Failed to save resume: ${insertError.message ?? 'Unknown error'}`,
    };
  }

  revalidatePath('/dashboard');
  return { resumeId: resume.id };
}

export async function getResumes() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function getResumeById(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();
  return data;
}
