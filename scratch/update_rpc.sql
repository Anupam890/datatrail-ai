
-- Update execute_sql to include expected output for mismatch analysis
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
    v_forbidden_keywords TEXT[] := ARRAY['DROP', 'TRUNCATE', 'ALTER', 'CREATE', 'GRANT', 'REVOKE']; -- Removed DELETE/UPDATE to allow some sandbox freedom if needed, but mostly for safety
    v_keyword TEXT;
BEGIN
    -- 1. Security Check
    FOREACH v_keyword IN ARRAY v_forbidden_keywords LOOP
        IF p_user_query ~* ('\b' || v_keyword || '\b') THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', 'Forbidden keyword detected: ' || v_keyword
            );
        END IF;
    END LOOP;

    -- 2. Fetch Data
    IF p_problem_id IS NOT NULL THEN
        SELECT schema_json, sample_data_json, expected_output_json
        INTO v_schema, v_sample_data, v_expected_output
        FROM problems
        WHERE id = p_problem_id;

        IF NOT FOUND THEN
            RETURN jsonb_build_object('success', false, 'error', 'Problem not found');
        END IF;
    ELSE
        -- Sandbox Defaults
        v_schema := '{"users": "id SERIAL PRIMARY KEY, name TEXT, email TEXT"}'::JSONB;
        v_sample_data := '{"users": [{"id": 1, "name": "Admin", "email": "admin@example.com"}]}'::JSONB;
        v_expected_output := NULL;
    END IF;

    -- 3. Setup Temp Tables
    FOR v_table_name, v_column_def IN SELECT * FROM jsonb_each_text(v_schema) LOOP
        EXECUTE format('CREATE TEMPORARY TABLE %I (%s) ON COMMIT DROP', v_table_name, v_column_def);
    END LOOP;

    FOR v_table_name IN SELECT * FROM jsonb_object_keys(v_sample_data) LOOP
        v_insert_query := format('INSERT INTO %I SELECT * FROM jsonb_populate_recordset(NULL::%I, %L)', 
                                 v_table_name, v_table_name, (v_sample_data->v_table_name));
        EXECUTE v_insert_query;
    END LOOP;

    -- 4. Execute
    v_start_time := clock_timestamp();
    BEGIN
        EXECUTE format('SELECT jsonb_agg(t) FROM (%s) t', p_user_query) INTO v_user_result;
    EXCEPTION WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'error', SQLERRM);
    END;
    v_end_time := clock_timestamp();
    v_exec_time := extract(epoch from (v_end_time - v_start_time)) * 1000;

    -- 5. Compare
    v_is_correct := (v_user_result = v_expected_output);

    RETURN jsonb_build_object(
        'success', v_is_correct,
        'result', v_user_result,
        'expected', v_expected_output,
        'execution_time', v_exec_time,
        'status', CASE WHEN v_is_correct THEN 'accepted' ELSE 'wrong' END
    );
END;
$$;
