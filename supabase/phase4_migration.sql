-- Phase 4 Migration: Community Features
-- Adds discussions, replies, voting, achievements, and notifications tables.

-- ============================================
-- 1. Discussions table
-- ============================================

CREATE TABLE IF NOT EXISTS discussions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    tags TEXT[] DEFAULT '{}',
    is_solved BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Discussions are viewable by everyone"
    ON discussions FOR SELECT USING (true);

CREATE POLICY "Users can insert their own discussions"
    ON discussions FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own discussions"
    ON discussions FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own discussions"
    ON discussions FOR DELETE USING (auth.uid()::text = user_id);

-- ============================================
-- 2. Discussion replies table
-- ============================================

CREATE TABLE IF NOT EXISTS discussion_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discussion_id UUID REFERENCES discussions(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_accepted BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Replies are viewable by everyone"
    ON discussion_replies FOR SELECT USING (true);

CREATE POLICY "Users can insert their own replies"
    ON discussion_replies FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own replies"
    ON discussion_replies FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own replies"
    ON discussion_replies FOR DELETE USING (auth.uid()::text = user_id);

-- ============================================
-- 3. Discussion votes table (covers both discussions and replies)
-- ============================================

CREATE TABLE IF NOT EXISTS discussion_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL CHECK (target_type IN ('discussion', 'reply')),
    target_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, target_type, target_id)
);

ALTER TABLE discussion_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Votes are viewable by everyone"
    ON discussion_votes FOR SELECT USING (true);

CREATE POLICY "Users can insert their own votes"
    ON discussion_votes FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own votes"
    ON discussion_votes FOR DELETE USING (auth.uid()::text = user_id);

-- ============================================
-- 4. Triggers: sync vote counts on discussions
-- ============================================

CREATE OR REPLACE FUNCTION update_discussion_vote_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_target_type TEXT;
    v_target_id UUID;
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_target_type := OLD.target_type;
        v_target_id := OLD.target_id;
    ELSE
        v_target_type := NEW.target_type;
        v_target_id := NEW.target_id;
    END IF;

    IF v_target_type = 'discussion' THEN
        UPDATE discussions SET
            likes_count = (SELECT COUNT(*) FROM discussion_votes WHERE target_type = 'discussion' AND target_id = v_target_id)
        WHERE id = v_target_id;
    ELSIF v_target_type = 'reply' THEN
        UPDATE discussion_replies SET
            likes_count = (SELECT COUNT(*) FROM discussion_votes WHERE target_type = 'reply' AND target_id = v_target_id)
        WHERE id = v_target_id;
    END IF;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_discussion_vote_change
    AFTER INSERT OR DELETE ON discussion_votes
    FOR EACH ROW EXECUTE FUNCTION update_discussion_vote_counts();

-- ============================================
-- 5. Trigger: sync replies_count on discussions
-- ============================================

CREATE OR REPLACE FUNCTION update_discussion_replies_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_discussion_id UUID;
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_discussion_id := OLD.discussion_id;
    ELSE
        v_discussion_id := NEW.discussion_id;
    END IF;

    UPDATE discussions SET
        replies_count = (SELECT COUNT(*) FROM discussion_replies WHERE discussion_id = v_discussion_id)
    WHERE id = v_discussion_id;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_discussion_reply_change
    AFTER INSERT OR DELETE ON discussion_replies
    FOR EACH ROW EXECUTE FUNCTION update_discussion_replies_count();

-- ============================================
-- 6. Achievements table
-- ============================================

CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
    achievement_key TEXT NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_key)
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Achievements are viewable by everyone"
    ON achievements FOR SELECT USING (true);

CREATE POLICY "System can insert achievements"
    ON achievements FOR INSERT WITH CHECK (true);

-- ============================================
-- 7. Notifications table
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'info',
    title TEXT NOT NULL,
    message TEXT,
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
    ON notifications FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "System can insert notifications"
    ON notifications FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
    ON notifications FOR UPDATE USING (auth.uid()::text = user_id);

-- ============================================
-- 8. Enable realtime on new tables
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE discussions;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
