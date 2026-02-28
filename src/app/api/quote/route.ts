import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { withRateLimit } from "@/lib/api-utils";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

async function quoteHandler(req: NextRequest) {
  try {
    const { size, loadIndex, speedRating } = await req.json();
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        error: "Configure OPENAI_API_KEY in .env",
        result: `[Mock Quote] Size: ${size} | Load: ${loadIndex} | Speed: ${speedRating}\nEU Label: B/C/72dB | DOT/ECE: compliant`,
      });
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a tire industry quoting expert. Based on the tire specifications provided, output professional quote details including:
- Size and spec description
- Load index and speed rating with max load/speed
- Estimated EU label grades (wet grip, rolling resistance, noise)
- DOT/ECE compliance`,
        },
        {
          role: "user",
          content: `Generate a quote for: size ${size}, load index ${loadIndex}, speed rating ${speedRating}.`,
        },
      ],
    });
    const result = completion.choices[0]?.message?.content || "No output";
    return NextResponse.json({ result });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: String(e), result: "AI call failed, check OPENAI_API_KEY" },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(quoteHandler);
