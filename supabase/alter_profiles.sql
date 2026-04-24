-- Migration: Align live database with updated migrations.sql
-- Run this against an existing database to bring it in sync.

-- ============================================
-- 1. Update profiles table
-- ============================================

-- Remove old column
ALTER TABLE profiles DROP COLUMN IF EXISTS github_link;

-- Add new columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS snowflake_config JSONB;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ============================================
-- 2. Drop dead tables
-- ============================================

DROP TABLE IF EXISTS progress;
DROP TABLE IF EXISTS lessons;

-- Drop orphaned RLS policies (ignore errors if they don't exist)
-- These were on the now-dropped lessons/progress tables and are auto-removed.

-- ============================================
-- 3. Create new tables
-- ============================================

CREATE TABLE IF NOT EXISTS user_preferences (
    user_id TEXT PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
    font_size INTEGER DEFAULT 14,
    tab_size INTEGER DEFAULT 2,
    sql_dialect TEXT DEFAULT 'postgresql',
    animated_transitions BOOLEAN DEFAULT true,
    compact_mode BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sql_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT,
    icon TEXT,
    color_key TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sql_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    track_id UUID REFERENCES sql_tracks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT,
    sort_order INTEGER DEFAULT 0,
    content JSONB,
    examples JSONB,
    tips JSONB,
    starter_code TEXT,
    prev_slug TEXT,
    next_slug TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
    lesson_slug TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lesson_slug)
);

-- ============================================
-- 4. Enable RLS on new tables
-- ============================================

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE sql_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE sql_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. Add RLS policies for new tables
-- ============================================

-- Add missing INSERT policy on profiles
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Add missing INSERT policy on submissions
CREATE POLICY "Users can insert their own submissions" ON submissions FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- User Preferences
CREATE POLICY "Users can view their own preferences" ON user_preferences FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own preferences" ON user_preferences FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update their own preferences" ON user_preferences FOR UPDATE USING (auth.uid()::text = user_id);

-- SQL Tracks & Lessons (public read)
CREATE POLICY "SQL tracks are viewable by everyone" ON sql_tracks FOR SELECT USING (true);
CREATE POLICY "SQL lessons are viewable by everyone" ON sql_lessons FOR SELECT USING (true);

-- Lesson Progress
CREATE POLICY "Users can view their own lesson progress" ON lesson_progress FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own lesson progress" ON lesson_progress FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- ============================================
-- 6. Add exec_sql RPC function
-- ============================================

CREATE OR REPLACE FUNCTION exec_sql(query_text TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result JSONB;
BEGIN
    EXECUTE format('SELECT jsonb_agg(t) FROM (%s) t', query_text) INTO v_result;
    RETURN COALESCE(v_result, '[]'::JSONB);
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION '%', SQLERRM;
END;
$$;
