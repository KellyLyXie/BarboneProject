// src/app/page.tsx
"use client";

import { useState } from "react";
import SearchBar from "../components/SearchBar";
import { extractTickerFromQuery } from "@/utils/extractWithAI"; // 替换为 DeepSeek
import { extractTicker } from "@/utils/ticker";

export default function Home() {
  const [output, setOutput] = useState("");
  const [tickers, setTickers] = useState<string[]>([]);

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

    const finalTickers = validatedTickers.filter(Boolean) as string[];
    setTickers(finalTickers);
    setOutput(`User Input: ${query}\nExtracted Tickers: ${finalTickers.join(", ")}`);
  };

  return (
    <div className="container mx-auto p-4">
      <SearchBar onSearch={handleSearch} />
      <div className="mt-4">
        <h2>Output:</h2>
        <pre>{output}</pre>
        <h2>Extracted Tickers:</h2>
        {tickers.length > 0 ? (
          <ul>
            {tickers.map((ticker) => (
              <li key={ticker}>{ticker}</li>
            ))}
          </ul>
        ) : (
          <p>No tickers found</p>
        )}
      </div>
    </div>
  );
}