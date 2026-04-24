-- SQLArena Database Schema

-- 1. Tables

-- Problems Table
CREATE TABLE IF NOT EXISTS problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    description TEXT NOT NULL,
    schema_json JSONB NOT NULL, -- table names and column definitions
    sample_data_json JSONB NOT NULL, -- initial data to insert
    expected_output_json JSONB NOT NULL, -- the correct result set
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles Table (Extended user info)
CREATE TABLE IF NOT EXISTS profiles (
    user_id TEXT PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    website TEXT,
    snowflake_config JSONB,
    streak INTEGER DEFAULT 0,
    total_solved INTEGER DEFAULT 0,
    xp INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
    problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    status TEXT CHECK (status IN ('accepted', 'wrong', 'error')),
    execution_time FLOAT, -- in ms
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id TEXT PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
    font_size INTEGER DEFAULT 14,
    tab_size INTEGER DEFAULT 2,
    sql_dialect TEXT DEFAULT 'postgresql',
    animated_transitions BOOLEAN DEFAULT true,
    compact_mode BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SQL Tracks Table (Learning lab track groupings)
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

-- SQL Lessons Table (Individual lessons within tracks)
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

-- Lesson Progress Table (Tracks user completion of lessons)
CREATE TABLE IF NOT EXISTS lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
    lesson_slug TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lesson_slug)
);

-- 2. SQL Execution Engine (RPC)

CREATE OR REPLACE FUNCTION execute_sql(
    p_problem_id UUID DEFAULT NULL,
    p_user_query TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_schema JSONB;
    v_sample_data JSONB;
    v_expected_output JSONB;
    v_table_name TEXT;
    v_column_def TEXT;
    v_insert_query TEXT;
    v_user_result JSONB;
    v_start_time TIMESTAMP;
    v_end_time TIMESTAMP;
    v_exec_time FLOAT;
    v_is_correct BOOLEAN := FALSE;
    v_forbidden_keywords TEXT[] := ARRAY['DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'UPDATE', 'INSERT', 'CREATE', 'GRANT', 'REVOKE'];
    v_keyword TEXT;
BEGIN
    -- 1. Security Check: Forbidden Keywords
    FOREACH v_keyword IN ARRAY v_forbidden_keywords LOOP
        IF p_user_query ~* ('\b' || v_keyword || '\b') THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', 'Forbidden keyword detected: ' || v_keyword
            );
        END IF;
    END LOOP;

    -- 2. Fetch Problem Data or Use Sandbox Defaults
    IF p_problem_id IS NOT NULL THEN
        SELECT schema_json, sample_data_json, expected_output_json
        INTO v_schema, v_sample_data, v_expected_output
        FROM problems
        WHERE id = p_problem_id;

        IF NOT FOUND THEN
            RETURN jsonb_build_object('success', false, 'error', 'Problem not found');
        END IF;
    ELSE
        -- Default Sandbox Schema (e.g., employees and departments)
        v_schema := '{
            "employees": "id SERIAL PRIMARY KEY, name TEXT, role TEXT, salary INT, dept_id INT",
            "departments": "id SERIAL PRIMARY KEY, name TEXT, location TEXT"
        }'::JSONB;
        v_sample_data := '{
            "employees": [
                {"id": 1, "name": "Alice", "role": "Engineer", "salary": 90000, "dept_id": 1},
                {"id": 2, "name": "Bob", "role": "Designer", "salary": 80000, "dept_id": 2},
                {"id": 3, "name": "Charlie", "role": "Manager", "salary": 110000, "dept_id": 1}
            ],
            "departments": [
                {"id": 1, "name": "Engineering", "location": "San Francisco"},
                {"id": 2, "name": "Design", "location": "New York"}
            ]
        }'::JSONB;
        v_expected_output := NULL;
    END IF;

    -- 3. Set up Sandbox (Temporary Tables)
    -- We use a prefix 'sandbox_' to avoid any conflicts
    -- Note: Since this is inside a transaction, these temp tables are isolated.
    
    -- Iterate over schema_json to create tables
    FOR v_table_name, v_column_def IN SELECT * FROM jsonb_each_text(v_schema) LOOP
        EXECUTE format('CREATE TEMPORARY TABLE %I (%s) ON COMMIT DROP', v_table_name, v_column_def);
    END LOOP;

    -- Populate sample data
    -- sample_data_json structure: { "table_name": [ { "col": "val" }, ... ] }
    FOR v_table_name IN SELECT * FROM jsonb_object_keys(v_sample_data) LOOP
        v_insert_query := format('INSERT INTO %I SELECT * FROM jsonb_populate_recordset(NULL::%I, %L)', 
                                 v_table_name, v_table_name, (v_sample_data->v_table_name));
        EXECUTE v_insert_query;
    END LOOP;

    -- 4. Execute User Query
    v_start_time := clock_timestamp();
    BEGIN
        EXECUTE p_user_query INTO v_user_result;
        -- Convert result set to JSONB
        -- This is a simplified way to capture the output
        EXECUTE format('SELECT jsonb_agg(t) FROM (%s) t', p_user_query) INTO v_user_result;
    EXCEPTION WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
    END;
    v_end_time := clock_timestamp();
    v_exec_time := extract(epoch from (v_end_time - v_start_time)) * 1000;

    -- 5. Compare with Expected Output
    -- Basic comparison (JSONB equality)
    v_is_correct := (v_user_result = v_expected_output);

    RETURN jsonb_build_object(
        'success', v_is_correct,
        'result', v_user_result,
        'execution_time', v_exec_time,
        'status', CASE WHEN v_is_correct THEN 'accepted' ELSE 'wrong' END
    );
END;
$$;

-- Increment Profile Stats Helper
CREATE OR REPLACE FUNCTION increment_profile_stats(
    p_user_id TEXT,
    p_xp_to_add INTEGER
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE profiles
    SET total_solved = total_solved + 1,
        xp = xp + p_xp_to_add
    WHERE user_id = p_user_id;
END;
$$;

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, username, avatar_url)
    VALUES (
        new.id,
        COALESCE(new.name, split_part(new.email, '@', 1)),
        new.image
    );
    RETURN new;
END;
$$;

-- Trigger attachment
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON public."user"
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Sandbox SQL Execution (used by /api/sql for free-form SELECT queries)
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

-- 3. Row Level Security (RLS)

ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE sql_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE sql_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

-- Problems: publicly readable
CREATE POLICY "Public problems are viewable by everyone" ON problems FOR SELECT USING (true);

-- Profiles: publicly readable, owners can update/insert
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Submissions: owners can read and insert
CREATE POLICY "Submissions are viewable by owner" ON submissions FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own submissions" ON submissions FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- User Preferences: owners can read, insert, update
CREATE POLICY "Users can view their own preferences" ON user_preferences FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own preferences" ON user_preferences FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update their own preferences" ON user_preferences FOR UPDATE USING (auth.uid()::text = user_id);

-- SQL Tracks & Lessons: publicly readable
CREATE POLICY "SQL tracks are viewable by everyone" ON sql_tracks FOR SELECT USING (true);
CREATE POLICY "SQL lessons are viewable by everyone" ON sql_lessons FOR SELECT USING (true);

-- Lesson Progress: owners can read and insert
CREATE POLICY "Users can view their own lesson progress" ON lesson_progress FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own lesson progress" ON lesson_progress FOR INSERT WITH CHECK (auth.uid()::text = user_id);
