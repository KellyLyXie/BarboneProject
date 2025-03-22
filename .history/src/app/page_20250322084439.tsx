// src/app/page.tsx
"use client";

import { useState } from "react";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const [output, setOutput] = useState("");

  // const handleSearch = (query: string, lang: string, region: string) => {
  //   console.log(`Query: ${query}, Language: ${lang}, Region: ${region}`);
  //   setOutput(`Query: ${query}, Language: ${lang}, Region: ${region}`);
  // };

  return (
    <div className="container mx-auto p-4">
      <SearchBar onSearch={handleSearch} />
      <div className="mt-4">
        <h2>Output:</h2>
        <pre>{output}</pre>
      </div>
    </div>
  );
}