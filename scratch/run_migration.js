
const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];
let migration = "";

if (filePath) {
  const absolutePath = path.resolve(process.cwd(), filePath);
  migration = fs.readFileSync(absolutePath, 'utf8');
} else {
  migration = `
-- 1. Add count columns to problems table
ALTER TABLE problems ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
ALTER TABLE problems ADD COLUMN IF NOT EXISTS dislikes_count INTEGER DEFAULT 0;
ALTER TABLE problems ADD COLUMN IF NOT EXISTS solutions_count INTEGER DEFAULT 0;
ALTER TABLE problems ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;

-- 2. Problem Votes Table
CREATE TABLE IF NOT EXISTS problem_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
    problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
    vote_type TEXT CHECK (vote_type IN ('like', 'dislike')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, problem_id)
);

-- 3. Problem Solutions Table
CREATE TABLE IF NOT EXISTS problem_solutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
    problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    query TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Problem Comments Table
CREATE TABLE IF NOT EXISTS problem_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
    problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Solution Votes (to like solutions)
CREATE TABLE IF NOT EXISTS solution_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
    solution_id UUID REFERENCES problem_solutions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, solution_id)
);

-- 6. Triggers to update counts
CREATE OR REPLACE FUNCTION update_problem_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        IF (TG_TABLE_NAME = 'problem_votes') THEN
            IF (NEW.vote_type = 'like') THEN
                UPDATE problems SET likes_count = likes_count + 1 WHERE id = NEW.problem_id;
            ELSE
                UPDATE problems SET dislikes_count = dislikes_count + 1 WHERE id = NEW.problem_id;
            END IF;
        ELSIF (TG_TABLE_NAME = 'problem_solutions') THEN
            UPDATE problems SET solutions_count = solutions_count + 1 WHERE id = NEW.problem_id;
        ELSIF (TG_TABLE_NAME = 'problem_comments') THEN
            UPDATE problems SET comments_count = comments_count + 1 WHERE id = NEW.problem_id;
        END IF;
    ELSIF (TG_OP = 'DELETE') THEN
        IF (TG_TABLE_NAME = 'problem_votes') THEN
            IF (OLD.vote_type = 'like') THEN
                UPDATE problems SET likes_count = likes_count - 1 WHERE id = OLD.problem_id;
            ELSE
                UPDATE problems SET dislikes_count = dislikes_count - 1 WHERE id = OLD.problem_id;
            END IF;
        ELSIF (TG_TABLE_NAME = 'problem_solutions') THEN
            UPDATE problems SET solutions_count = solutions_count - 1 WHERE id = OLD.problem_id;
        ELSIF (TG_TABLE_NAME = 'problem_comments') THEN
            UPDATE problems SET comments_count = comments_count - 1 WHERE id = OLD.problem_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_problem_votes_count ON problem_votes;
CREATE TRIGGER tr_problem_votes_count AFTER INSERT OR DELETE ON problem_votes FOR EACH ROW EXECUTE FUNCTION update_problem_counts();

DROP TRIGGER IF EXISTS tr_problem_solutions_count ON problem_solutions;
CREATE TRIGGER tr_problem_solutions_count AFTER INSERT OR DELETE ON problem_solutions FOR EACH ROW EXECUTE FUNCTION update_problem_counts();

DROP TRIGGER IF EXISTS tr_problem_comments_count ON problem_comments;
CREATE TRIGGER tr_problem_comments_count AFTER INSERT OR DELETE ON problem_comments FOR EACH ROW EXECUTE FUNCTION update_problem_counts();

-- 7. RLS Policies
ALTER TABLE problem_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE solution_votes ENABLE ROW LEVEL SECURITY;

-- Handle existing policies gracefully or drop them if needed. 
-- For now we assume if they exist, it's fine.
`;
}

async function run() {
  try {
    await client.connect();
    console.log('Connected to database');
    await client.query(migration);
    console.log('Migration completed successfully');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

run();
