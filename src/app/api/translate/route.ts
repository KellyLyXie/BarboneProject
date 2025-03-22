// src/app/api/translate/route.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * 处理 POST 请求，代理调用 DeepSeek 翻译 API
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 从请求体中解析出 text, target_lang
    const { text, target_lang } = await request.json();

    // 2. 调用 DeepSeek 翻译 API
    const deepSeekRes = await fetch("https://api.deepseek.com/v3/translate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        target_lang,
      }),
    });

    // 3. 解析 DeepSeek 的响应
    const data = await deepSeekRes.json();
    console.log("DeepSeek API data:", data);
    // 4. 将 DeepSeek 的响应原封返回给前端
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("^^^DeepSeek API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}