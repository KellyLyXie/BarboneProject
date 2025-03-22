// src/utils/ticker.ts


export interface FMPStock {
    symbol: string;
    name?: string;
    exchange?: string;
  }
  

  export async function fetchTickers(): Promise<Set<string>> {
    const apiKey = process.env.NEXT_PUBLIC_FMP_API_KEY;
    const response = await fetch(`https://financialmodelingprep.com/api/v3/stock/list?apikey=${apiKey}`);
  
    if (!response.ok) {
      console.error("FMP API Error:", response.status, response.statusText);
      return new Set();
    }
  
    const data: unknown = await response.json();
  
    // 检查返回数据是否为数组
    if (!Array.isArray(data)) {
      console.error("FMP returned a non-array:", data);
      return new Set();
    }
  

    const stocks = data as FMPStock[];
  

    const symbols = stocks.map((item) => item.symbol.toUpperCase());
    return new Set(symbols);
  }
  
  // 搜索股票函数，根据查询字符串和区域返回 FMPStock 数组
  export async function searchStocks(query: string, region: string = "US"): Promise<FMPStock[]> {
    const apiKey = process.env.NEXT_PUBLIC_FMP_API_KEY;
    let exchangeParam = "";
    if (region === "US") {
      exchangeParam = "&exchange=NASDAQ"; // 可根据需要调整
    } else if (region === "HK") {
      exchangeParam = "&exchange=HKEX";
    } else if (region === "CN") {
      exchangeParam = "&exchange=SSE";
    }
    const url = `https://financialmodelingprep.com/api/v3/search?query=${encodeURIComponent(query)}&limit=10${exchangeParam}&apikey=${apiKey}`;
    console.log("Search URL:", url);
  
    const response = await fetch(url);
    if (!response.ok) {
      console.error("FMP Search API Error:", response.status, response.statusText);
      return [];
    }
    const data: unknown = await response.json();
    if (!Array.isArray(data)) {
      console.error("FMP Search API returned non-array:", data);
      return [];
    }
    // 类型断言 data 为 FMPStock 数组
    const stocks = data as FMPStock[];
    return stocks;
  }
  
  // 提取股票代码函数，根据用户输入和区域返回一个 ticker 数组
  export async function extractTicker(query: string, region: string = "US"): Promise<string[]> {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return [];
  
    if (!trimmedQuery.includes(" ")) {
      const tickersSet = await fetchTickers();
      const upperQuery = trimmedQuery.toUpperCase();
      if (tickersSet.has(upperQuery)) {
        return [upperQuery];
      } else {
        const searchResult = await searchStocks(trimmedQuery, region);
        if (searchResult.length > 0) {
          return [searchResult[0].symbol.toUpperCase()];
        }
        return [];
      }
    } else {
      const searchResult = await searchStocks(trimmedQuery, region);
      if (searchResult.length > 0) {
        return [searchResult[0].symbol.toUpperCase()];
      }
      return [];
    }
  }