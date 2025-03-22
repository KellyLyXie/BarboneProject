// src/utils/extractWithAI.ts

/**
 * 调用 GPT-4o mini API 解析用户输入的自然语言查询，
 * 提取出需要查询的股票代码（可以是多个，以逗号分隔）。
 *
 * @param query 用户输入的完整自然语言查询，例如 "Find me Apple stock price"
 * @param region 用户选择的市场（例如 "US", "HK", "CN", "Global"）
 * @param lang 用户输入的语言（例如 "en", "zh-cn", "zh-tw"）
 * @returns 返回一个字符串，格式例如 "AAPL" 或 "BABA, NVDA"
 */
export async function extractTickerFromQuery(query: string, region: string, lang: string): Promise<string> {
    // 构造 prompt，明确告诉 AI 只返回股票代码，并根据区域过滤双重上市情况
    const prompt = `
  You are an expert financial analyst. Given a natural language query about stocks, extract only the relevant stock ticker(s) that conform to the Financial Modeling Prep (FMP) format. Follow these rules:
  - If the query mentions a ticker directly (like "AAPL" or "NVDA"), output that ticker.
  - If the query mentions a company name (for example "Apple" or "Microsoft"), output its ticker ("AAPL" for Apple, "MSFT" for Microsoft).
  - For dual-listed stocks:
      * If the user's market is "US", output the US ticker (e.g. "BABA" for Alibaba).
      * If the user's market is "HK", output the Hong Kong ticker (e.g. "9988.HK" for Alibaba).
  - Only output the ticker(s) separated by commas, with no extra text.
  
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
  
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o", // 或 gpt-4-turbo
            messages: [{
              role: "user",
              content: prompt
            }],
            temperature: 0.1,
            max_tokens: 50,
            response_format: { type: "text" } // 强制返回纯文本
          })
        });
    
        const data = await response.json();
        let result = data.choices[0]?.message?.content?.trim() || "";
        
        // 安全过滤
        result = result.replace(/[^A-Z0-9\.,]/g, '');
        
        return result;
      } catch (error) {
        console.error('GPT API Error:', error);
        return "";
      }
    }
    