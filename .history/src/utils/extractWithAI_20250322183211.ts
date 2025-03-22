// src/utils/extractWithAI.ts

/**
 * Deepseek
 *
 * @param query 
 * @param region 
 * @param lang 
 * @returns 
 * 
 */
export async function extractTickerFromQuery(
    query: string,
    region: string,
    lang: string
  ): Promise<string> {
//     const prompt = `
//   You are an expert financial analyst. Given a natural language query about stocks, extract only the relevant stock ticker(s) that conform to the Financial Modeling Prep (FMP) format. Follow these rules:
//   - If the query mentions a ticker directly (like "AAPL" or "NVDA"), output that ticker.
//   - If the query mentions a company name (for example "Apple" or "Microsoft"), output its ticker ("AAPL" for Apple, "MSFT" for Microsoft).
//   - For dual-listed stocks:
//       * If the user's market is "US", output the US ticker (e.g. "BABA" for Alibaba).
//       * If the user's market is "HK", output the Hong Kong ticker (e.g. "9988.HK" for Alibaba).
//   - Only output the ticker(s) separated by commas, with no extra text.
  
//   Examples:
//   Query: "Find me Apple stock price", Market: "US" -> Answer: "AAPL"
//   Query: "compare BABA and NVDA", Market: "Global" -> Answer: "BABA, NVDA"
//   Query: "HSBC", Market: "HK" -> Answer: "0005.HK"
//   Query: "BABA", Market: "US" -> Answer: "BABA"
//   Query: "BABA", Market: "HK" -> Answer: "9988.HK"
//   Query: "random text with no stock info", Market: "US" -> Answer: "NO_TICKER_FOUND"
//   Query: "random text with no stock info", Market: "UK" -> Answer: "NO_TICKER_FOUND"
//   Query: "random text with no stock info", Market: "CN" -> Answer: "NO_TICKER_FOUND"
//   Query: "random text with no stock info", Market: "Global" -> Answer: "NO_TICKER_FOUND"
  
//   Now, based on the input below, output only the ticker(s):
//   Query: "${query}"
//   Market: "${region}"
//   Language: "${lang}"
//     `;
const prompt = `
        You are an expert financial analyst. Given a natural language query about stocks, extract only the relevant stock ticker(s) that conform to the Financial Modeling Prep (FMP) format. Follow these rules:
        - If the query mentions a ticker directly (like "AAPL" or "NVDA"), output that ticker.
        - If the query mentions a company name (for example "Apple" or "Microsoft"), output its ticker ("AAPL" for Apple, "MSFT" for Microsoft).
        - For dual-listed stocks:
            * If the user's market is "US", output the US ticker (e.g. "BABA" for Alibaba).
            * If the user's market is "HK", output the Hong Kong ticker (e.g. "9988.HK" for Alibaba).
            * If the user's market is "Global", output the ticker with the higher stock price or market cap.
        - If no stock ticker is found, return "NO_TICKER_FOUND".
        - Only output the ticker(s) separated by commas, with no extra text.
        - If the user explicitly mentions "港股" or "HK" in the query, prioritize the Hong Kong ticker for that stock, even in Global mode.
        - If the user explicitly mentions "美股" or "HK" in the query, prioritize the Hong Kong ticker for that stock, even in Global mode.

        Examples:
        Query: "Find me Apple stock price", Market: "US" -> Answer: "AAPL"
        Query: "compare BABA and NVDA", Market: "Global" -> Answer: "BABA, NVDA"
        Query: "HSBC", Market: "HK" -> Answer: "0005.HK"
        Query: "BABA", Market: "US" -> Answer: "BABA"
        Query: "BABA", Market: "HK" -> Answer: "9988.HK"
        Query: "Alibaba", Market: "Global" -> Answer: "BABA" (if US ticker has higher price/market cap) or "9988.HK" (if HK ticker has higher price/market cap)
        Query: "random text with no stock info", Market: "US" -> Answer: "NO_TICKER_FOUND"

        Now, based on the input below, output only the ticker(s):
        Query: "${query}"
        Market: "${region}"
        Language: "${lang}"
    `;
    try {
      // for OpenAI API
    //   const response = await fetch('https://api.openai.com/v1/chat/completions', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
    //     },
    //     body: JSON.stringify({
    //       model: "gpt-4o", // 或 gpt-4-turbo
    //       messages: [{ role: "user", content: prompt }],
    //       temperature: 0.1,
    //       max_tokens: 50,
    //       response_format: { type: "text" }
    //     })
    //   });
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`, 
            },
            body: JSON.stringify({
            model: "deepseek-chat", // deepseek model
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1,
            max_tokens: 50,
            })
        });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.error?.message}`);
      }
  
      // parse the response
      const data = await response.json();
      let result = data.choices[0]?.message?.content?.trim() || "";
  
      result = result.replace(/[^A-Z0-9\.,]/g, '');
  
      return result;
    } catch (error) {
      console.error('GPT API Error:', error);
      return "";
    }
  }