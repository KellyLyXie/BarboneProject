import { useState } from "react";
import SearchBar from "../components/SearchBar";
import { extractTickerFromQuery } from "@/utils/extractWithDeepSeek";
import { extractTicker, StockItem } from "@/utils/ticker";

export default function Home() {
  const [output, setOutput] = useState("");
  const [tickers, setTickers] = useState<StockItem[]>([]);

  const handleSearch = async (query: string, lang: string, region: string) => {
    console.log(`Query: ${query}, Language: ${lang}, Region: ${region}`);

    // 调用 DeepSeek API 解析查询
    const tickerResult = await extractTickerFromQuery(query, region, lang);
    console.log("DeepSeek extracted result:", tickerResult);
    if (!tickerResult) {
      setTickers([]);
      setOutput("No tickers found");
      return;
    }

    // 调用 FMP API 验证和补充股票代码
    const tickerList = tickerResult.split(",").map(t => t.trim()).filter(Boolean);
    const validatedTickers = await Promise.all(
      tickerList.map(async (ticker) => {
        const result = await extractTicker(ticker, region);
        return result.length > 0 ? result[0] : null;
      })
    );

    const finalTickers = validatedTickers.filter(Boolean) as StockItem[];
    setTickers(finalTickers);
    setOutput(`User Input: ${query}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <SearchBar onSearch={handleSearch} />

      <div className="mt-6 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Output:</h2>
        <pre className="whitespace-pre-wrap">{output}</pre>

        <h2 className="text-xl font-semibold mt-6 mb-4">Extracted Tickers:</h2>
        {tickers.length > 0 ? (
          <ul className="space-y-2">
            {tickers.map((ticker) => (
              <li key={ticker.symbol} className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">{ticker.symbol}</div>
                {ticker.name && (
                  <div className="text-sm text-gray-600">{ticker.name}</div>
                )}
                {ticker.exchange && (
                  <div className="text-sm text-gray-500">{ticker.exchange}</div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No tickers found</p>
        )}
      </div>
    </div>
  );
}