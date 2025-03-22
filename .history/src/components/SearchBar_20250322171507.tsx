import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string, lang: string, region: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("en");
  const [region, setRegion] = useState("US");

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      {/* 输入框 */}
      <input
        type="text"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter stock query..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* 语言和地区选择 */}
      <div className="mt-4 flex space-x-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="en">English</option>
          <option value="zh-cn">简体中文</option>
          <option value="zh-tw">繁體中文</option>
        </select>

        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="US">US</option>
          <option value="HK">HK</option>
          <option value="CN">CN</option>
          <option value="Global">Global</option>
        </select>
      </div>

      <button
        onClick={() => onSearch(query, language, region)}
        className="w-full mt-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;