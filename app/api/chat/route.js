import Groq from "groq-sdk";
import { supabase } from "@/lib/supabase";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message || message.trim() === "") {
      return Response.json({ reply: "Please enter a message." }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a career counselor for Indian college students. Give practical, honest advice. If the user asks anything unrelated to careers, education or skills, politely tell them you can only help with career related questions.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    // await supabase.from("chats").insert({ message, reply });
    const { error } = await supabase.from("chats").insert({ message, reply });
    if (error) console.error("Supabase error:", error);

    return Response.json({ reply });

  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { reply: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}