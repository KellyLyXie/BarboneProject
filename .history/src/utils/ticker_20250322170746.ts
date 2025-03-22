// src/utils/ticker.ts
export interface StockItem {
    symbol: string;
    name?: string;
    exchange?: string;
  }
  
  // Get all stock tickers from the API FM
  export async function fetchTickers(): Promise<Set<string>> {
    const apiKey = process.env.NEXT_PUBLIC_FMP_API_KEY;
    const response = await fetch(`https://financialmodelingprep.com/api/v3/stock/list?apikey=${apiKey}`);
    
    if (!response.ok) {
      console.error("FMP API Error:", response.status, response.statusText);
      return new Set();
    }
    
    const data = await response.json();
    if (!Array.isArray(data)) {
      console.error("FMP returned a non-array:", data);
      return new Set();
    }
    
    const symbols = data.map((item: any) => item.symbol.toUpperCase());
    return new Set(symbols);
  }
  
  // 搜索股票
  export async function searchStocks(query: string, region: string = "US"): Promise<StockItem[]> {
    const apiKey = process.env.NEXT_PUBLIC_FMP_API_KEY;
    let exchangeParam = "";
  
    if (region === "US") {
      exchangeParam = "&exchange=NASDAQ";
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
    const data = await response.json();
    if (!Array.isArray(data)) {
      console.error("FMP Search API returned non-array:", data);
      return [];
    }
    return data.map((item: any) => ({
      symbol: item.symbol,
      name: item.name,
      exchange: item.exchange,
    }));
  }

  export async function extractTicker(query: string, region: string = "US"): Promise<string[]> {
    // 去掉两边空格
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return [];
  
    // 如果输入中没有空格，则认为是单个单词
    if (!trimmedQuery.includes(" ")) {
      // 先尝试严格匹配：获取所有股票代码集合
      const tickersSet = await fetchTickers();
      const upperQuery = trimmedQuery.toUpperCase();
      if (tickersSet.has(upperQuery)) {
        // 如果直接匹配到了，就返回该 ticker
        return [upperQuery];
      } else {
        // 否则调用搜索接口
        const searchResult = await searchStocks(trimmedQuery, region);
        if (searchResult.length > 0) {
          return [searchResult[0].symbol.toUpperCase()];
        }
        return [];
      }
    } else {
      // 如果包含多个单词，则将整个输入作为短语来搜索
      const searchResult = await searchStocks(trimmedQuery, region);
      if (searchResult.length > 0) {
        // 这里简单地取第一个搜索结果的 ticker
        return [searchResult[0].symbol.toUpperCase()];
      }
      return [];
    }
  }
