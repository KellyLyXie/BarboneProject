// src/utils/ticker.ts

export interface StockItem {
    symbol: string;
    name?: string;
    exchange?: string;
}

// 获取所有股票代码
export async function fetchTickers(): Promise<Set<string>> {
    // 从环境变量中读取 Key
    const apiKey = process.env.NEXT_PUBLIC_FMP_API_KEY;
    
    // 拼接到请求 URL 中
    const response = await fetch(`https://financialmodelingprep.com/api/v3/stock/list?apikey=${apiKey}`);
    
    // 如果响应不成功，抛出或返回空
    if (!response.ok) {
      console.error("FMP API Error:", response.status, response.statusText);
      return new Set();
    }
    
    // 将响应解析为 JSON
    const data = await response.json();
    
    // 如果 data 不是数组，说明 API 可能返回了错误信息
    if (!Array.isArray(data)) {
      console.error("FMP returned a non-array:", data);
      return new Set();
    }
    
    // 将 symbol 转为大写后存入 Set
    const symbols = data.map((item: any) => item.symbol.toUpperCase());
    return new Set(symbols);
  }
  
  // 提取用户输入中的有效股票代码
  export async function extractTicker(query: string): Promise<string[]> {
    const tickersSet = await fetchTickers();
  
    // 按空格分割用户输入
    const words = query.split(/\s+/).map((w) => w.trim()).filter(Boolean);
    
    // 只保留在 FMP 列表中的符号
    const matched = words.filter((word) => tickersSet.has(word.toUpperCase()));
    
    // 返回大写后的股票代码
    return matched.map((m) => m.toUpperCase());
  }