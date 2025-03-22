// src/app/page.tsx
"use client";

import { useState } from "react";
import SearchBar from "../components/SearchBar";
import { extractTickerFromQuery } from "@/utils/extractWithAI"; // 替换为 DeepSeek
import { extractTicker } from "@/utils/ticker";

