// src/utils/translate.ts
export const translateQuery = async (query: string, lang: string): Promise<string> => {
    // 如果语言是英文，则无需翻译
    if (lang === "en") return query;
  
    // 调用 DeepSeek 翻译 API
    const response = await fetch("https://api.deepseek.com/v3/translate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: query,
        target_lang: "en",
      }),
    });
  
    const data = await response.json();
    // 返回翻译结果，如果出错则返回原查询
    return data.translation || query;
  };