// src/utils/ticker.ts

/**
 * 从 FMP 获取全部股票列表，返回一个大写的股票代码集合
 */
export async function fetchTickers() {
        const response = await fetch(`https://financialmodelingprep.com/api/v3/stock/list?apikey=${process.env.NEXT_PUBLIC_FMP_API_KEY}`);
        const data = await response.json();
        // data 里包含许多股票信息，先只拿 symbol 转为大写放进集合
        const symbols = data.map((stock) => stock.symbol.toUpperCase());
        return new Set(symbols);
    }
    
    /**
     * 根据用户输入，提取符合 FMP 格式的股票代码（严格匹配）
     * @param query - 翻译后的文本
     * @returns 股票代码数组
     */
    export async function extractTicker(query: string): Promise<string[]> {
        const tickersSet = await fetchTickers();
        // 按空格分割，逐词匹配
        const words = query.split(/\s+/).map((w) => w.trim()).filter(Boolean);
        
        // 在 FMP 列表里出现的才算有效
        const matched = words.filter((word) => tickersSet.has(word.toUpperCase()));
        
        return matched.map((m) => m.toUpperCase());
    }
