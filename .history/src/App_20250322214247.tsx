// src/App.tsx

import React from "react";
import StockProvider from "src/context/StockContext.tsx"
import SearchBar from "./components/SearchBar";
import Home from "./app/page";

function App() {
  return (
    <StockProvider>
      <Home />
    </StockProvider>
  );
}

export default App;