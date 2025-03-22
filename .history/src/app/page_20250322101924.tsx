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