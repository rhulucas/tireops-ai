import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { withRateLimit } from "@/lib/api-utils";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

async function quoteHandler(req: NextRequest) {
  try {
    const { size, loadIndex, speedRating } = await req.json();
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        error: "请在 .env 中配置 OPENAI_API_KEY",
        result: `【模拟报价】尺寸: ${size} | 载重指数: ${loadIndex} | 速度级别: ${speedRating}\nEU 标签: B/C/72dB | DOT/ECE: 符合`,
      });
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `你是轮胎行业报价专家。根据用户输入的轮胎规格，输出专业的报价信息，包括：
- 尺寸与规格说明
- 载重指数与速度级别对应最大载重/速度
- 预估 EU 标签等级（湿地抓地、滚动阻力、噪音）
- DOT/ECE 合规说明`,
        },
        {
          role: "user",
          content: `请为以下轮胎规格生成报价：尺寸 ${size}，载重指数 ${loadIndex}，速度级别 ${speedRating}。`,
        },
      ],
    });
    const result = completion.choices[0]?.message?.content || "无输出";
    return NextResponse.json({ result });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: String(e), result: "AI 调用失败，请检查 OPENAI_API_KEY" },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(quoteHandler);
