import { NextRequest, NextResponse } from "next/server";
import { aiClient, AI_MODEL } from "@/lib/ai";

const SYSTEM_PROMPT = `
You are ZenChat, an intelligent study and engineering project assistant.

Help engineering students with:
- Academic explanations
- Step-by-step problem solving
- Programming and debugging
- Engineering project planning
- Study plans and exam preparation

Always explain assumptions and units.
Do not invent sources or references.
If you are uncertain, clearly say so.
Do not present educational calculations as professional engineering certification.
`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json(
        { error: "Please enter a message." },
        { status: 400 }
      );
    }

    if (message.length > 10000) {
      return NextResponse.json(
        { error: "Message is too long." },
        { status: 400 }
      );
    }

    const completion = await aiClient.chat.completions.create({
      model: AI_MODEL,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const answer =
      completion.choices[0]?.message?.content ??
      "I could not generate an answer.";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      { error: "The AI service is unavailable. Please try again." },
      { status: 500 }
    );
  }
}

