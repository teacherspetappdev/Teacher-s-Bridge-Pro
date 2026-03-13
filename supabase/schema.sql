-- Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (triggered by auth)
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- CURRICULUM_DOCS TABLE
-- ============================================

CREATE TABLE public.curriculum_docs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for curriculum_docs
ALTER TABLE public.curriculum_docs ENABLE ROW LEVEL SECURITY;

-- Users can view their own documents
CREATE POLICY "Users can view own curriculum_docs"
  ON public.curriculum_docs FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own documents
CREATE POLICY "Users can insert own curriculum_docs"
  ON public.curriculum_docs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own documents
CREATE POLICY "Users can update own curriculum_docs"
  ON public.curriculum_docs FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own documents
CREATE POLICY "Users can delete own curriculum_docs"
  ON public.curriculum_docs FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- LESSON_PLANS TABLE
-- ============================================

CREATE TABLE public.lesson_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  grade_level TEXT,
  subject TEXT,
  objectives JSONB DEFAULT '[]',
  materials JSONB DEFAULT '[]',
  activities JSONB DEFAULT '[]',
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for lesson_plans
ALTER TABLE public.lesson_plans ENABLE ROW LEVEL SECURITY;

-- Users can view their own lesson plans
CREATE POLICY "Users can view own lesson_plans"
  ON public.lesson_plans FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own lesson plans
CREATE POLICY "Users can insert own lesson_plans"
  ON public.lesson_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own lesson plans
CREATE POLICY "Users can update own lesson_plans"
  ON public.lesson_plans FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own lesson plans
CREATE POLICY "Users can delete own lesson_plans"
  ON public.lesson_plans FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- RAG / VECTOR SEARCH FUNCTIONS
-- ============================================

-- Function to find similar documents using vector similarity
CREATE OR REPLACE FUNCTION public.match_curriculum_docs(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.title,
    c.content,
    1 - (c.embedding <=> query_embedding) AS similarity
  FROM public.curriculum_docs c
  WHERE c.embedding IS NOT NULL
    AND 1 - (c.embedding <=> query_embedding) > match_threshold
    AND c.user_id = auth.uid()
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
