import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchTickers } from "@/utils/ticker"; 

// 定义 Context 中存储的数据结构
interface StockContextType {
  tickersCache: Set<string> | null;
}

// 创建 Context 对象，默认值为 { tickersCache: null }
const StockContext = createContext<StockContextType>({ tickersCache: null });

// Provider 组件：在组件挂载时预加载股票列表数据
export const StockProvider = ({ children }: { children: React.ReactNode }) => {
  const [tickersCache, setTickersCache] = useState<Set<string> | null>(null);

  useEffect(() => {
    // 组件挂载后调用 fetchTickers() 并将返回结果存入状态中
    fetchTickers().then((data) => {
      setTickersCache(data);
      console.log("Stock tickers loaded and cached.");
    }).catch((err) => {
      console.error("Error fetching tickers:", err);
    });
  }, []);

  return (
    <StockContext.Provider value={{ tickersCache }}>
      {children}
    </StockContext.Provider>
  );
};

// 自定义 Hook 方便在其他组件中使用 Context
export const useStockContext = () => useContext(StockContext);