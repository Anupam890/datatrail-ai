import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPG, PNG, GIF, and WebP are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 2MB." },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop() || "jpg";
    const filePath = `${userId}.${ext}`;

    // Delete any existing avatar files for this user first
    const { data: existingFiles } = await supabase.storage
      .from("avatars")
      .list("", { search: userId });

    if (existingFiles && existingFiles.length > 0) {
      await supabase.storage
        .from("avatars")
        .remove(existingFiles.map((f) => f.name));
    }

    // Upload new avatar
    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    // Update profile with avatar URL (use update, not upsert, to avoid NOT NULL constraint on username)
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("user_id", userId)
      .single();

    if (existingProfile) {
      const { error: dbError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
        .eq("user_id", userId);
      if (dbError) throw dbError;
    } else {
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          user_id: userId,
          username: `user_${userId.slice(0, 8)}`,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        });
      if (insertError) throw insertError;
    }

    return NextResponse.json({ avatar_url: avatarUrl });
  } catch (error: any) {
    console.error("Avatar Upload Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload avatar" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const supabase = getServiceSupabase();
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Find and delete avatar files for this user
    const { data: existingFiles } = await supabase.storage
      .from("avatars")
      .list("", { search: userId });

    if (existingFiles && existingFiles.length > 0) {
      const { error: deleteError } = await supabase.storage
        .from("avatars")
        .remove(existingFiles.map((f) => f.name));

      if (deleteError) throw deleteError;
    }

    // Clear avatar_url in profile
    const { error: dbError } = await supabase
      .from("profiles")
      .update({ avatar_url: null, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Avatar Delete Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete avatar" },
      { status: 500 }
    );
  }
}
