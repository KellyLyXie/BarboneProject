// src/App.tsx

import React from "react";
import StockProvider from "./context/StockContext"; // 确保路径正确
import SearchBar from "./components/SearchBar";
import Home from "./Home"; // 你现有的页面组件，可以是 Home.tsx 或 index.tsx

function App() {
  return (
    <StockProvider>
      <Home />
    </StockProvider>
  );
}

export default App;