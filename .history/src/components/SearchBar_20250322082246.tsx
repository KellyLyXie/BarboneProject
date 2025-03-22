import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string, lang: string, region: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("en");
  const [region, setRegion] = useState("US");

  return (
    <div className="p-4">
      <input
        type="text"
        className="border p-2 w-full"
        placeholder="Enter stock query..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="mt-2">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 border mr-2"
        >
          <option value="en">English</option>
          <option value="zh-cn">简体中文</option>
          <option value="zh-tw">繁體中文</option>
        </select>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="p-2 border"
        >
          <option value="US">US</option>
          <option value="HK">HK</option>
          <option value="CN">CN</option>
          <option value="Global">Global</option>
        </select>
      </div>
      <button
        onClick={() => onSearch(query, language, region)}
        className="mt-2 p-2 bg-blue-500 text-white"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;