-- Phase 2 Migration: Activate existing data features
-- Adds streak tracking columns, bookmarks table, and achievements table.

-- ============================================
-- 1. Add streak tracking columns to profiles
-- ============================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_solved_date DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS best_streak INTEGER DEFAULT 0;

-- ============================================
-- 2. Create bookmarks table
-- ============================================

CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
    problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, problem_id)
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookmarks"
    ON bookmarks FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own bookmarks"
    ON bookmarks FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own bookmarks"
    ON bookmarks FOR DELETE USING (auth.uid()::text = user_id);

-- ============================================
-- 3. Update streak calculation function
-- Called from the execute API after accepted submission.
-- Logic: if last_solved_date = today, no-op.
--        if last_solved_date = yesterday, increment streak.
--        otherwise, reset streak to 1.
--        Always update best_streak if current > best.
-- ============================================

CREATE OR REPLACE FUNCTION update_user_streak(p_user_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_last_date DATE;
    v_current_streak INTEGER;
    v_best_streak INTEGER;
    v_today DATE := CURRENT_DATE;
BEGIN
    SELECT last_solved_date, streak, best_streak
    INTO v_last_date, v_current_streak, v_best_streak
    FROM profiles
    WHERE user_id = p_user_id;

    -- If already solved today, do nothing
    IF v_last_date = v_today THEN
        RETURN;
    END IF;

    -- If solved yesterday, increment streak
    IF v_last_date = v_today - INTERVAL '1 day' THEN
        v_current_streak := COALESCE(v_current_streak, 0) + 1;
    ELSE
        -- Gap > 1 day or first solve ever: reset to 1
        v_current_streak := 1;
    END IF;

    -- Update best_streak if current exceeds it
    IF v_current_streak > COALESCE(v_best_streak, 0) THEN
        v_best_streak := v_current_streak;
    END IF;

    UPDATE profiles
    SET streak = v_current_streak,
        best_streak = v_best_streak,
        last_solved_date = v_today
    WHERE user_id = p_user_id;
END;
$$;
