// // src/app/page.tsx
// "use client";

// import { useState } from "react";
// import SearchBar from "../components/SearchBar";
// import { translateQuery } from "@/utils/translate"; 

// export default function Home() {
//   const [output, setOutput] = useState("");

//   const handleSearch = (query: string, lang: string, region: string) => {
//     console.log(`Query: ${query}, Language: ${lang}, Region: ${region}`);
//     setOutput(`Query: ${query}, Language: ${lang}, Region: ${region}`);
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <SearchBar onSearch={handleSearch} />
//       <div className="mt-4">
//         <h2>Output:</h2>
//         <pre>{output}</pre>
//       </div>
//     </div>
//   );
// }


// // 示例: src/app/page.tsx
// "use client";
// import { useState } from "react";
// import SearchBar from "../components/SearchBar";
// import { translateQuery } from "../utils/translate";

// export default function Home() {
//   const [output, setOutput] = useState("");

//   const handleSearch = async (query: string, lang: string, region: string) => {
//     // 调用翻译
//     const translated = await translateQuery(query, lang);
//     setOutput(`Original: ${query}\nTranslated: ${translated}\nRegion: ${region}`);
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <SearchBar onSearch={handleSearch} />
//       <pre className="mt-4">{output}</pre>
//     </div>
//   );
// }



// // src/app/page.tsx
// "use client";

// import { useState } from "react";
// import SearchBar from "../components/SearchBar";
// import { extractTicker } from "@/utils/ticker";

// export default function Home() {
//   const [output, setOutput] = useState("");
//   const [tickers, setTickers] = useState<string[]>([]);

//   const handleSearch = async (query: string, lang: string, region: string) => {
//     // 调用 extractTicker
//     const extracted = await extractTicker(query);
//     setTickers(extracted);

//     // 显示信息
//     setOutput(
//       `Query: ${query}\nLanguage: ${lang}\nRegion: ${region}\nExtracted Tickers: ${extracted.join(", ")}`
//     );
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <SearchBar onSearch={handleSearch} />
//       <div className="mt-4">
//         <h2>Output:</h2>
//         <pre>{output}</pre>
//         <h2>Extracted Tickers:</h2>
//         {tickers.length > 0 ? (
//           <ul>
//             {tickers.map((ticker) => (
//               <li key={ticker}>{ticker}</li>
//             ))}
//           </ul>
//         ) : (
//           <p>No tickers found</p>
//         )}
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useState } from "react";
// import SearchBar from "../components/SearchBar";
// import { extractTicker } from "@/utils/ticker";

// export default function Home() {
//   const [output, setOutput] = useState("");
//   const [tickers, setTickers] = useState<string[]>([]);

//   const handleSearch = async (query: string, lang: string, region: string) => {
//     console.log(`Query: ${query}, Language: ${lang}, Region: ${region}`);

//     // 调用改造后的 extractTicker
//     const extracted = await extractTicker(query);

//     if (extracted.length > 0) {
//       setTickers(extracted);
//       setOutput(`User Input: ${query}\nExtracted Tickers: ${extracted.join(", ")}`);
//     } else {
//       setTickers([]);
//       setOutput("No tickers found for your query.");
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <SearchBar onSearch={handleSearch} />
//       <div className="mt-4">
//         <h2>Output:</h2>
//         <pre>{output}</pre>
//         <h2>Extracted Tickers:</h2>
//         {tickers.length > 0 ? (
//           <ul>
//             {tickers.map((ticker) => (
//               <li key={ticker}>{ticker}</li>
//             ))}
//           </ul>
//         ) : (
//           <p>No tickers found</p>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import SearchBar from "../components/SearchBar";
import { extractTickerFromQuery } from "@/utils/extractWithAI";
// 你还可以继续保留现有的 ticker.ts 函数做二次验证或过滤（可选）

export default function Home() {
  const [output, setOutput] = useState("");
  const [tickers, setTickers] = useState<string[]>([]);

  const handleSearch = async (query: string, lang: string, region: string) => {
    console.log(`Query: ${query}, Language: ${lang}, Region: ${region}`);
    
    // 调用 AI 提取函数，解析出股票代码
    const tickerResult = await extractTickerFromQuery(query, region, lang);
    console.log("AI extracted result:", tickerResult);
    
    // 将返回的 ticker 字符串按逗号拆分（如果有多个 ticker）
    const tickerList = tickerResult.split(",").map(t => t.trim()).filter(Boolean);
    
    setTickers(tickerList);
    setOutput(`User Input: ${query}\nExtracted Tickers: ${tickerList.join(", ")}`);
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