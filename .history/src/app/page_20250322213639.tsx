"use client";

import { useState } from "react";
import SearchBar from "../components/SearchBar";
import { extractTickerFromQuery } from "@/utils/extractWithAI"; 
import { extractTicker } from "@/utils/ticker";

export default function Home() {
  const [output, setOutput] = useState("");
  const [tickers, setTickers] = useState<string[]>([]);

  const handleSearch = async (query: string, lang: string, region: string) => {
    console.log(`Query: ${query}, Language: ${lang}, Region: ${region}`);

    const tickerResult = await extractTickerFromQuery(query, region, lang);
    console.log("DeepSeek extracted result:", tickerResult);

    if (!tickerResult) {
      setTickers([]);
      setOutput("No tickers found");
      return;
    }
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
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Stock Ticker Identifier
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Enter your query and select your preferences to extract the correct stock ticker.
        </p>
        <SearchBar onSearch={handleSearch} />
        <div className="mt-8 border-t pt-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Input:</h2>
          <pre className="bg-gray-50 p-4 rounded text-gray-800 whitespace-pre-wrap">
            {output}
          </pre>
          <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-2">Result:</h2>
          {tickers.length > 0 ? (
            <ul className="list-disc list-inside text-gray-800">
              {tickers.map((ticker) => (
                <li key={ticker} className="mb-1">{ticker}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No tickers found</p>
          )}
        </div>
      </div>
    </div>
  );
}