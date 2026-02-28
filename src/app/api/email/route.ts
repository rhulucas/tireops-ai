import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { withRateLimit } from "@/lib/api-utils";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

const scenarioPrompts: Record<string, string> = {
  oem: "针对 OEM 主机厂认证咨询，专业、合规、技术细节完整",
  fleet: "针对车队批量采购询价，突出性价比与售后服务",
  warranty: "针对质保投诉，态度诚恳、解决方案清晰、符合行业规范",
};

async function emailHandler(req: NextRequest) {
  try {
    const { scenario, content } = await req.json();
    const style = scenarioPrompts[scenario] || "专业、礼貌";
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        result: `【模拟回复】场景: ${scenario}\n根据输入内容，生成符合轮胎行业${style}的邮件回复。\n请配置 OPENAI_API_KEY 使用真实 AI。`,
      });
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `你是轮胎行业商务邮件专家。根据用户选择的场景（OEM 认证/车队询价/质保投诉）和提供的客户邮件要点，撰写专业、得体的中文回复。风格：${style}。`,
        },
        { role: "user", content: content || "请根据当前场景生成一封示范回复。" },
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

export const POST = withRateLimit(emailHandler);
