export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type CurriculumDoc = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  embedding: number[] | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type LessonPlan = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  grade_level: string | null;
  subject: string | null;
  objectives: string[] | null;
  materials: string[] | null;
  activities: string[] | null;
  duration_minutes: number | null;
  created_at: string;
  updated_at: string;
};
