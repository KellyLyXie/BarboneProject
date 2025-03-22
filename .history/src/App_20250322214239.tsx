// src/App.tsx

import React from "react";
import StockProvider from 
import SearchBar from "./componensrc/context/StockContext.tsxts/SearchBar";
import Home from "./app/page";

function App() {
  return (
    <StockProvider>
      <Home />
    </StockProvider>
  );
}

export default App;