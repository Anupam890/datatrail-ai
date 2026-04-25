import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function test() {
  console.log('🧪 Testing SQL Execution RPC...');

  // 1. Test Sandbox (no problem_id)
  console.log('\n--- Sandbox Mode ---');
  const { data: sandboxData, error: sandboxError } = await supabase.rpc('execute_sql', {
    p_user_query: 'SELECT * FROM employees WHERE salary > 100000'
  });

  if (sandboxError) console.error('Sandbox Error:', sandboxError);
  else console.log('Sandbox Result:', JSON.stringify(sandboxData, null, 2));

  // 2. Test Forbidden Keyword
  console.log('\n--- Forbidden Keyword ---');
  const { data: forbiddenData, error: forbiddenError } = await supabase.rpc('execute_sql', {
    p_user_query: 'DROP TABLE employees'
  });

  if (forbiddenError) console.error('Forbidden Error:', forbiddenError);
  else console.log('Forbidden Result:', JSON.stringify(forbiddenData, null, 2));

  // 3. Test Seeded Problem
  console.log('\n--- Seeded Problem (High Margin Products) ---');
  const { data: prob } = await supabase.from('problems').select('id').eq('slug', 'high-margin-products').single();
  
  if (prob) {
    const { data: probData, error: probError } = await supabase.rpc('execute_sql', {
      p_problem_id: prob.id,
      p_user_query: 'SELECT name, price - cost as margin FROM products WHERE price >= cost * 2'
    });

    if (probError) console.error('Problem Error:', probError);
    else console.log('Problem Result:', JSON.stringify(probData, null, 2));
  } else {
    console.log('Problem not found for testing.');
  }
}

test().catch(console.error);
