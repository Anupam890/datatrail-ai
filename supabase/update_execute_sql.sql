-- Enhanced SQL Execution Engine (RPC)
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
    v_trimmed_query TEXT;
    -- More comprehensive blacklist
    v_forbidden_keywords TEXT[] := ARRAY[
        'DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'UPDATE', 'INSERT', 'CREATE', 
        'GRANT', 'REVOKE', 'COMMIT', 'ROLLBACK', 'COPY', 'VACUUM', 'ANALYZE'
    ];
    v_keyword TEXT;
BEGIN
    -- 1. Security Check: Basic query presence
    IF p_user_query IS NULL OR trim(p_user_query) = '' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Query cannot be empty');
    END IF;

    v_trimmed_query := trim(p_user_query);

    -- 2. Security Check: Only allow SELECT/WITH
    IF NOT (
        v_trimmed_query ILIKE 'SELECT%' OR 
        v_trimmed_query ILIKE 'WITH%'
    ) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Only SELECT and WITH queries are allowed.'
        );
    END IF;

    -- 3. Security Check: Forbidden Keywords
    FOREACH v_keyword IN ARRAY v_forbidden_keywords LOOP
        IF p_user_query ~* ('\b' || v_keyword || '\b') THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', 'Forbidden keyword detected: ' || v_keyword
            );
        END IF;
    END LOOP;

    -- 4. Fetch Problem Data or Sandbox Defaults
    IF p_problem_id IS NOT NULL THEN
        SELECT schema_json, sample_data_json, expected_output_json
        INTO v_schema, v_sample_data, v_expected_output
        FROM problems
        WHERE id = p_problem_id;

        IF NOT FOUND THEN
            RETURN jsonb_build_object('success', false, 'error', 'Problem not found');
        END IF;
    ELSE
        -- Default Sandbox Schema
        v_schema := '{
            "employees": "id INT, name TEXT, role TEXT, salary INT, dept_id INT",
            "departments": "id INT, name TEXT, location TEXT"
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

    -- 5. Setup Execution Environment
    PERFORM set_config('statement_timeout', '3000', true); -- 3 seconds
    
    -- Sub-block to catch execution errors
    BEGIN
        -- Create tables from schema
        FOR v_table_name, v_column_def IN SELECT * FROM jsonb_each_text(v_schema) LOOP
            EXECUTE format('CREATE TEMPORARY TABLE %I (%s) ON COMMIT DROP', v_table_name, v_column_def);
        END LOOP;

        -- Populate data
        FOR v_table_name IN SELECT * FROM jsonb_object_keys(v_sample_data) LOOP
            EXECUTE format('INSERT INTO %I SELECT * FROM jsonb_populate_recordset(NULL::%I, %L)', 
                           v_table_name, v_table_name, (v_sample_data->v_table_name));
        END LOOP;

        -- Execute User Query with Limit
        v_start_time := clock_timestamp();
        EXECUTE format('SELECT jsonb_agg(t) FROM ( %s LIMIT 1000 ) t', p_user_query) INTO v_user_result;
        v_end_time := clock_timestamp();
        
        v_user_result := COALESCE(v_user_result, '[]'::JSONB);
        v_exec_time := extract(epoch from (v_end_time - v_start_time)) * 1000;

        -- 6. Result Validation
        IF v_expected_output IS NOT NULL THEN
            v_is_correct := (v_user_result = v_expected_output);
        ELSE
            v_is_correct := TRUE;
        END IF;

    EXCEPTION WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'execution_time', extract(epoch from (clock_timestamp() - v_start_time)) * 1000
        );
    END;

    RETURN jsonb_build_object(
        'success', v_is_correct,
        'result', v_user_result,
        'execution_time', v_exec_time,
        'status', CASE WHEN v_is_correct THEN 'accepted' ELSE 'wrong' END
    );
END;
$$;
