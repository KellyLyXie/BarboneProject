// src/utils/extractWithAI.ts

/**
 * 调用 GPT-4o-mini API 解析用户输入的自然语言查询，提取出所需的股票查询关键词或 ticker。
 * 返回的结果应该仅包含股票代码（多个用逗号分隔），且根据市场过滤后符合 FMP 格式。
 *
 * @param query 用户输入的完整自然语言查询
 * @param region 用户选择的市场偏好（例如 "US", "HK", "CN", "Global"）
 * @param lang 用户输入的语言（例如 "en", "zh-cn", "zh-tw"）
 * @returns 返回一个字符串，格式如 "AAPL" 或 "BABA, NVDA"
 */
export async function extractTickerFromQuery(query: string, region: string, lang: string): Promise<string> {
    // 构造 prompt，告诉 AI 只输出股票代码，且根据 region 做区分
    const prompt = `
  You are an expert financial analyst. Given a natural language query about stocks, extract only the relevant stock ticker(s) that match the Financial Modeling Prep (FMP) format. Follow these rules:
  - If the query mentions a ticker directly (like "AAPL" or "NVDA"), output that ticker.
  - If the query mentions a company name (for example "Apple" or "Microsoft"), output its ticker ("AAPL" for Apple, "MSFT" for Microsoft).
  - For dual-listed stocks: 
      * If the user's market is "US", output the US ticker (e.g., "BABA" for Alibaba).
      * If the user's market is "HK", output the Hong Kong ticker (e.g., "9988.HK" for Alibaba).
  - Only output the ticker(s), separated by commas with no extra words.
    
  Examples:
  Query: "Find me Apple stock price", Market: "US" -> Answer: "AAPL"
  Query: "compare BABA and NVDA", Market: "Global" -> Answer: "BABA, NVDA"
  Query: "HSBC", Market: "HK" -> Answer: "0005.HK"  
  Query: "BABA", Market: "US" -> Answer: "BABA"
  Query: "BABA", Market: "HK" -> Answer: "9988.HK"
    
  Now, based on the input below, output only the ticker(s):
  Query: "${query}"
  Market: "${region}"
  Language: "${lang}"
  `;
  
    // 调用 GPT-4o-mini API
    const apiEndpoint = process.env.NEXT_PUBLIC_GPT4O_MINI_API_URL; // 例如 "https://api.gpt4o-mini.example.com/v1/completions"
    const apiKey = process.env.NEXT_PUBLIC_GPT4O_MINI_API_KEY;
    
    const requestBody = {
      prompt,
      max_tokens: 20,
      temperature: 0.0,
    };
  
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });
    
    const data = await response.json();
    // 假设返回数据格式为 { choices: [ { text: "AAPL" } ] }
    if (data && Array.isArray(data.choices) && data.choices.length > 0) {
      return data.choices[0].text.trim();
    }
    return "";
  }