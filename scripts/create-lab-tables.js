const { Client } = require("pg");

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  console.log("Connected to database");

  // Create sql_tracks table
  await client.query(`
    CREATE TABLE IF NOT EXISTS sql_tracks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      icon TEXT NOT NULL DEFAULT 'Database',
      color_key TEXT NOT NULL DEFAULT 'basics',
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `);
  console.log("Created sql_tracks table");

  // Create sql_lessons table
  await client.query(`
    CREATE TABLE IF NOT EXISTS sql_lessons (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      track_id UUID REFERENCES sql_tracks(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      content JSONB NOT NULL DEFAULT '[]',
      examples JSONB NOT NULL DEFAULT '[]',
      tips JSONB NOT NULL DEFAULT '[]',
      starter_code TEXT NOT NULL DEFAULT '',
      prev_slug TEXT,
      next_slug TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `);
  console.log("Created sql_lessons table");

  // Create lesson_progress table
  await client.query(`
    CREATE TABLE IF NOT EXISTS lesson_progress (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT NOT NULL,
      lesson_slug TEXT NOT NULL,
      completed_at TIMESTAMPTZ DEFAULT now(),
      UNIQUE(user_id, lesson_slug)
    );
  `);
  console.log("Created lesson_progress table");

  // Enable RLS on all tables
  await client.query(`ALTER TABLE sql_tracks ENABLE ROW LEVEL SECURITY;`);
  await client.query(`ALTER TABLE sql_lessons ENABLE ROW LEVEL SECURITY;`);
  await client.query(`ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;`);

  // RLS policies - tracks and lessons are publicly readable
  // Drop then create to avoid "already exists" errors
  const policies = [
    { name: "Anyone can read tracks", table: "sql_tracks", sql: `CREATE POLICY "Anyone can read tracks" ON sql_tracks FOR SELECT USING (true)` },
    { name: "Anyone can read lessons", table: "sql_lessons", sql: `CREATE POLICY "Anyone can read lessons" ON sql_lessons FOR SELECT USING (true)` },
    { name: "Anyone can read progress", table: "lesson_progress", sql: `CREATE POLICY "Anyone can read progress" ON lesson_progress FOR SELECT USING (true)` },
    { name: "Anyone can insert progress", table: "lesson_progress", sql: `CREATE POLICY "Anyone can insert progress" ON lesson_progress FOR INSERT WITH CHECK (true)` },
    { name: "Anyone can update progress", table: "lesson_progress", sql: `CREATE POLICY "Anyone can update progress" ON lesson_progress FOR UPDATE USING (true)` },
  ];

  for (const p of policies) {
    try {
      await client.query(`DROP POLICY IF EXISTS "${p.name}" ON ${p.table}`);
      await client.query(p.sql);
    } catch (e) {
      console.log(`Policy "${p.name}": ${e.message}`);
    }
  }
  console.log("RLS policies created");

  await client.end();
  console.log("Done - tables created successfully");
}

main().catch((e) => { console.error(e.message); process.exit(1); });
