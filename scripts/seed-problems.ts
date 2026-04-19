import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log("Reading seed_problems.json...");
  const filePath = path.join(process.cwd(), "supabase", "seed_problems.json");
  const rawData = fs.readFileSync(filePath, "utf-8");
  const problems = JSON.parse(rawData);

  console.log(`Found ${problems.length} problems. Starting seed...`);

  const { data, error } = await supabase
    .from("problems")
    .upsert(problems, { onConflict: "slug" });

  if (error) {
    console.error("Error seeding problems:", error);
    process.exit(1);
  }

  console.log("Successfully seeded problems!");
}

seed();
