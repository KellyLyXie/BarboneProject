// src/App.tsx

import React from "react";
import { StockProvider } from "./context/StockContext";
import Home from "./app/page";

function App() {
  return (
    <StockProvider>
      <Home />
    </StockProvider>
  );
}

export default App;