-- Phase 1 Migration: Add missing tables, columns, triggers, and RLS policies
-- Run this against your Supabase database to fix broken features.

-- ============================================
-- 1. Add missing columns to problems table
-- ============================================

ALTER TABLE problems ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
ALTER TABLE problems ADD COLUMN IF NOT EXISTS dislikes_count INTEGER DEFAULT 0;
ALTER TABLE problems ADD COLUMN IF NOT EXISTS solutions_count INTEGER DEFAULT 0;
ALTER TABLE problems ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;

-- ============================================
-- 2. Create problem_votes table
-- ============================================

CREATE TABLE IF NOT EXISTS problem_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
    problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
    vote_type TEXT CHECK (vote_type IN ('like', 'dislike')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, problem_id)
);

ALTER TABLE problem_votes ENABLE ROW LEVEL SECURITY;

-- Everyone can read votes (needed for count display)
CREATE POLICY "Votes are viewable by everyone"
    ON problem_votes FOR SELECT USING (true);

-- Authenticated users can insert their own votes
CREATE POLICY "Users can insert their own votes"
    ON problem_votes FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Users can delete their own votes (for toggling)
CREATE POLICY "Users can delete their own votes"
    ON problem_votes FOR DELETE USING (auth.uid()::text = user_id);

-- ============================================
-- 3. Create problem_solutions table
-- ============================================

CREATE TABLE IF NOT EXISTS problem_solutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    query TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE problem_solutions ENABLE ROW LEVEL SECURITY;

-- Everyone can read solutions
CREATE POLICY "Solutions are viewable by everyone"
    ON problem_solutions FOR SELECT USING (true);

-- Authenticated users can insert their own solutions
CREATE POLICY "Users can insert their own solutions"
    ON problem_solutions FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Users can update their own solutions
CREATE POLICY "Users can update their own solutions"
    ON problem_solutions FOR UPDATE USING (auth.uid()::text = user_id);

-- Users can delete their own solutions
CREATE POLICY "Users can delete their own solutions"
    ON problem_solutions FOR DELETE USING (auth.uid()::text = user_id);

-- ============================================
-- 4. Triggers to keep vote counts in sync
-- ============================================

-- Trigger function: update likes/dislikes count on problems after vote changes
CREATE OR REPLACE FUNCTION update_problem_vote_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_problem_id UUID;
BEGIN
    -- Determine which problem_id was affected
    IF TG_OP = 'DELETE' THEN
        v_problem_id := OLD.problem_id;
    ELSE
        v_problem_id := NEW.problem_id;
    END IF;

    -- Recount from source of truth
    UPDATE problems SET
        likes_count = (SELECT COUNT(*) FROM problem_votes WHERE problem_id = v_problem_id AND vote_type = 'like'),
        dislikes_count = (SELECT COUNT(*) FROM problem_votes WHERE problem_id = v_problem_id AND vote_type = 'dislike')
    WHERE id = v_problem_id;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_problem_vote_change
    AFTER INSERT OR DELETE ON problem_votes
    FOR EACH ROW EXECUTE FUNCTION update_problem_vote_counts();

-- ============================================
-- 5. Trigger to keep solutions_count in sync
-- ============================================

CREATE OR REPLACE FUNCTION update_problem_solutions_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_problem_id UUID;
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_problem_id := OLD.problem_id;
    ELSE
        v_problem_id := NEW.problem_id;
    END IF;

    UPDATE problems SET
        solutions_count = (SELECT COUNT(*) FROM problem_solutions WHERE problem_id = v_problem_id)
    WHERE id = v_problem_id;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_problem_solution_change
    AFTER INSERT OR DELETE ON problem_solutions
    FOR EACH ROW EXECUTE FUNCTION update_problem_solutions_count();

-- ============================================
-- 6. Enable realtime on required tables
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE problems;
ALTER PUBLICATION supabase_realtime ADD TABLE submissions;
