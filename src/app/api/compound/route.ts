import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { withRateLimit } from "@/lib/api-utils";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

async function compoundHandler(req: NextRequest) {
  try {
    const { polymers, fillers, vulcanization } = await req.json();
    const p = Array.isArray(polymers) ? polymers.join("、") : "未选";
    const f = Array.isArray(fillers) ? fillers.join("、") : "未选";
    const v = Array.isArray(vulcanization) ? vulcanization.join("、") : "未选";
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        result: `【模拟配方】\n聚合物: ${p}\n填料: ${f}\n硫化: ${v}\n\nphr 配方示例:\n- 生胶 100\n- 炭黑 50\n- 硫磺 2\n- 促进剂 1.5\n\nEU 标签预测: 湿地 B | 阻力 C | 噪音 72dB\n请配置 OPENAI_API_KEY 使用完整 AI。`,
      });
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `你是橡胶配方专家。根据用户选择的聚合物（SBR/NR/BR/IR）、填料、硫化体系，输出完整的 phr 配方（每 100 份生胶的用量），并预测 EU 标签等级（湿地抓地、滚动阻力、噪音）。格式清晰，使用中文。`,
        },
        {
          role: "user",
          content: `聚合物：${p}；填料：${f}；硫化：${v}。请生成 phr 配方并预测 EU 标签。`,
        },
      ],
    });
    const result = completion.choices[0]?.message?.content || "无输出";
    return NextResponse.json({ result });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: String(e), result: "AI 调用失败" },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(compoundHandler);
