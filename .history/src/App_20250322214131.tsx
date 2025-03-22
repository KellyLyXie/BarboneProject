// src/App.tsx

import React from "react";
import StockProvider from "./context/StockContext"; // 确保路径正确
import SearchBar from "./components/SearchBar";
import Home from "./Home"; 

function App() {
  return (
    <StockProvider>
      <Home />
    </StockProvider>
  );
}

export default App;