import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { withRateLimit } from "@/lib/api-utils";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

const scenarioPrompts: Record<string, string> = {
  oem: "OEM certification inquiry - professional, compliant, technical detail",
  fleet: "Fleet bulk inquiry - value and after-sales focus",
  warranty: "Warranty complaint - sincere, clear resolution, industry compliant",
};

async function emailHandler(req: NextRequest) {
  try {
    const { scenario, content } = await req.json();
    const style = scenarioPrompts[scenario] || "professional, courteous";
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        result: `[Mock Reply] Scenario: ${scenario}\nGenerate tire industry ${style} email.\nConfigure OPENAI_API_KEY for real AI.`,
      });
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a tire industry business email expert. Based on the scenario (OEM cert/fleet inquiry/warranty complaint) and customer points, write a professional reply. Style: ${style}.`,
        },
        { role: "user", content: content || "Generate a sample reply for the current scenario." },
      ],
    });
    const result = completion.choices[0]?.message?.content || "No output";
    return NextResponse.json({ result });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: String(e), result: "AI call failed" },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(emailHandler);
