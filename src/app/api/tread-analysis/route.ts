import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { withRateLimit } from "@/lib/api-utils";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

async function treadHandler(req: NextRequest) {
  try {
    const { elements } = await req.json();
    const desc = Array.isArray(elements) ? elements.join("、") : "胎面设计元素";
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        result: `【模拟分析】设计元素: ${desc}\n湿地抓地: B | 噪音: 72dB | 滚动阻力: C\n导出 Mold CNC 规格请使用导出按钮。`,
      });
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `你是轮胎胎面设计专家。根据用户描述的设计元素（排水槽、胎块、刀槽、凹纹等），分析并预测：
1. 湿地抓地等级（EU 标签 A-E）
2. 滚动噪音（dB）
3. 滚动阻力等级
4. Mold CNC 规格建议（简要）`,
        },
        { role: "user", content: `设计元素：${desc}。请进行 AI 分析。` },
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

export const POST = withRateLimit(treadHandler);
