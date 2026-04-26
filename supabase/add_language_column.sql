-- Add language column to problems table
-- Supports: 'sql' (default), 'python', 'pandas'

ALTER TABLE problems
ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'sql';

-- Update existing pandas-tagged problems
UPDATE problems
SET language = 'pandas'
WHERE 'pandas' = ANY(tags)
  AND language = 'sql';

-- Update existing python-tagged problems
UPDATE problems
SET language = 'python'
WHERE 'python' = ANY(tags)
  AND language = 'sql'
  AND language != 'pandas';

-- Add a check constraint
ALTER TABLE problems
ADD CONSTRAINT problems_language_check
CHECK (language IN ('sql', 'python', 'pandas'));

-- Create index for language-based filtering
CREATE INDEX IF NOT EXISTS idx_problems_language ON problems (language);
