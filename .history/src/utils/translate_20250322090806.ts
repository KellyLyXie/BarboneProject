// src/utils/translate.ts
export const translateQuery = async (query: string, lang: string): Promise<string> => {
  if (lang === "en") return query;

  try {
    // 现在改为请求本地 /api/translate 路由
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: query,
        target_lang: "en",
      }),
    });

    if (!response.ok) {
      // 如果服务器返回非 200 状态码，抛出错误
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    // data.translation 应该是 DeepSeek 返回的翻译结果
    console.log("Response from /api/translate:", data);
    return data.translation || query;
  } catch (error) {
    console.error("Translation error:", error);
    return query; // 出错时返回原查询，避免页面崩溃
  }
};