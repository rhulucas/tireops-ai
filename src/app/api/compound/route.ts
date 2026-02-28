import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { withRateLimit } from "@/lib/api-utils";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

async function compoundHandler(req: NextRequest) {
  try {
    const { polymers, fillers, vulcanization } = await req.json();
    const p = Array.isArray(polymers) ? polymers.join(", ") : "none";
    const f = Array.isArray(fillers) ? fillers.join(", ") : "none";
    const v = Array.isArray(vulcanization) ? vulcanization.join(", ") : "none";
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        result: `[Mock Formula]\nPolymers: ${p}\nFillers: ${f}\nVulcanization: ${v}\n\nSample phr:\n- Rubber 100\n- Carbon black 50\n- Sulfur 2\n- Accelerator 1.5\n\nEU prediction: Wet B | Resistance C | Noise 72dB\nConfigure OPENAI_API_KEY for full AI.`,
      });
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a rubber compound expert. Based on selected polymers (SBR/NR/BR/IR), fillers, and vulcanization system, output a complete phr formula (per 100 parts rubber) and predict EU label grades (wet grip, rolling resistance, noise). Use clear formatting.`,
        },
        {
          role: "user",
          content: `Polymers: ${p}; Fillers: ${f}; Vulcanization: ${v}. Generate phr formula and predict EU label.`,
        },
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

export const POST = withRateLimit(compoundHandler);
