import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log('🌱 Seeding problems...');
  
  const seedDataPath = path.join(process.cwd(), 'supabase', 'seed_problems.json');
  const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));

  for (const problem of seedData) {
    console.log(`Inserting problem: ${problem.title}`);
    
    // Calculate expected output if not provided (or use provided one)
    // For now, we assume seed_problems.json has expected_output_json
    // If not, we might need a step to generate it.
    
    const { error } = await supabase
      .from('problems')
      .upsert({
        title: problem.title,
        slug: problem.slug,
        difficulty: problem.difficulty,
        description: problem.description,
        schema_json: problem.schema_json,
        sample_data_json: problem.sample_data_json,
        expected_output_json: problem.expected_output_json || [],
        tags: problem.tags || []
      }, { onConflict: 'slug' });

    if (error) {
      console.error(`Error inserting ${problem.title}:`, error.message);
    }
  }

  console.log('✅ Seeding complete!');
}

seed().catch(console.error);
