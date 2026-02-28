'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type CreateJobDescriptionState = {
  error?: string;
  jobDescriptionId?: string;
};

export async function createJobDescription(
  _prev: CreateJobDescriptionState,
  formData: FormData
): Promise<CreateJobDescriptionState> {
  const content = formData.get('content') as string | null;
  if (!content?.trim()) {
    return { error: 'Please paste a job description.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'You must be signed in.' };
  }

  const { data: jd, error } = await supabase
    .from('job_descriptions')
    .insert({ user_id: user.id, content: content.trim() })
    .select('id')
    .single();

  if (error) {
    return { error: 'Failed to save job description.' };
  }

  revalidatePath('/dashboard');
  return { jobDescriptionId: jd.id };
}

export async function getJobDescriptions() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('job_descriptions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function getJobDescriptionById(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('job_descriptions')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();
  return data;
}
