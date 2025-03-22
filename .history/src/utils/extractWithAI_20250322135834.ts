// src/utils/extractWithAI.ts

export async function extractTickerFromQuery(
    query: string, 
    region: string, 
    lang: string
  ): Promise<string> {
    // 优化后的提示词
    const prompt = `
  [角色]
  您是中国市场金融数据分析专家，需要精准识别用户查询中的股票信息
  
  [输入]
  用户查询："${query}"
  目标市场：${region}
  语言：${lang}
  
  [输出要求]
  1. 严格输出股票代码，多个代码用英文逗号分隔
  2. 按市场规范转换代码：
     - 港股：自动添加 .HK 后缀（例：腾讯 → 0700.HK）
     - A股：沪市 .SS，深市 .SZ（例：茅台 → 600519.SS）
     - 美股：保持原始代码（例：苹果 → AAPL）
  3. 中文查询需识别公司简称/全称（例："中国平安" → 601318.SS）
  4. 双重上市优先选择目标市场代码
  
  [示例]
  输入："苹果和腾讯股价" 市场："HK" → AAPL,0700.HK
  输入："NVDA和茅台" 市场："CN" → NVDA,600519.SS
  `;
  
    try {
      // 使用标准的OpenAI API端点
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
      
      // 强化结果处理
      let result = data.choices[0]?.message?.content?.trim() || "";
      
      // 安全过滤
      result = result.replace(/[^A-Z0-9\.,]/g, '');
      
      return result;
    } catch (error) {
      console.error('GPT API Error:', error);
      return "";
    }
  }