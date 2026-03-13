import { createClient as createServerClient } from "@/supabase/server";
import type { Profile, LessonPlan } from "@/supabase/types";

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data;
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, "full_name" | "avatar_url">>
): Promise<Profile> {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createLessonPlan(
  userId: string,
  lessonPlan: Omit<LessonPlan, "id" | "user_id" | "created_at" | "updated_at">
): Promise<LessonPlan> {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from("lesson_plans")
    .insert({
      user_id: userId,
      ...lessonPlan,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getLessonPlans(userId: string): Promise<LessonPlan[]> {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from("lesson_plans")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getLessonPlan(userId: string, planId: string): Promise<LessonPlan | null> {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from("lesson_plans")
    .select("*")
    .eq("id", planId)
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return data;
}

export async function updateLessonPlan(
  userId: string,
  planId: string,
  updates: Partial<Omit<LessonPlan, "id" | "user_id" | "created_at" | "updated_at">>
): Promise<LessonPlan> {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from("lesson_plans")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", planId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLessonPlan(userId: string, planId: string): Promise<void> {
  const supabase = await createServerClient();
  
  const { error } = await supabase
    .from("lesson_plans")
    .delete()
    .eq("id", planId)
    .eq("user_id", userId);

  if (error) throw error;
}
