const { createClient } = require("@supabase/supabase-js");

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(url, key);

  // Create avatars bucket (public so URLs are accessible)
  const { data, error } = await supabase.storage.createBucket("avatars", {
    public: true,
    fileSizeLimit: 2 * 1024 * 1024, // 2MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  });

  if (error) {
    if (error.message?.includes("already exists")) {
      console.log("Bucket 'avatars' already exists - OK");
    } else {
      console.error("Error creating bucket:", error.message);
      process.exit(1);
    }
  } else {
    console.log("Bucket 'avatars' created successfully:", data);
  }

  // Verify bucket
  const { data: buckets } = await supabase.storage.listBuckets();
  const avatarBucket = buckets?.find((b) => b.name === "avatars");
  console.log("Bucket details:", avatarBucket);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
