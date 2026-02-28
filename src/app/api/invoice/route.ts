import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { withRateLimit } from "@/lib/api-utils";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

async function invoiceHandler(req: NextRequest) {
  try {
    const { warrantyMiles, certFee, items } = await req.json();
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        result: `[Mock Invoice]\nItems: ${items}\nTread warranty: ${warrantyMiles} mi\nCert fee: $${certFee}\n---\nConfigure OPENAI_API_KEY for full AI.`,
      });
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a tire industry finance expert. Generate invoice content including:
- Line items
- Tread warranty terms (e.g. xxx mi guarantee)
- Certification document fee
- Payment terms`,
        },
        {
          role: "user",
          content: `Warranty ${warrantyMiles} mi, cert fee $${certFee}, items: ${items}.`,
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

export const POST = withRateLimit(invoiceHandler);
