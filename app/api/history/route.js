import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;

    return Response.json({ chats: data });
  } catch (error) {
    console.error("Error fetching history:", error);
    return Response.json({ chats: [] });
  }
}