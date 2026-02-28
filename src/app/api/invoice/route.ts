import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { withRateLimit } from "@/lib/api-utils";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

async function invoiceHandler(req: NextRequest) {
  try {
    const { warrantyMiles, certFee, items } = await req.json();
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        result: `【模拟发票】\n项目: ${items}\n胎纹质保: ${warrantyMiles} mi\n认证文件费: $${certFee}\n---\n请配置 OPENAI_API_KEY 使用 AI 生成完整条款。`,
      });
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `你是轮胎行业财务专家。根据用户输入生成规范的发票内容，包括：
- 项目明细
- 胎纹质保条款（如 xxx mi guarantee）
- 认证文件费说明
- 付款条款`,
        },
        {
          role: "user",
          content: `质保 ${warrantyMiles} mi，认证费 $${certFee}，项目：${items}。`,
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

export const POST = withRateLimit(invoiceHandler);
