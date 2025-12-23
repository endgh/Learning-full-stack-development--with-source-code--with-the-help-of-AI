// config.js - Moonshot 官方兼容版

export const API_KEY = "";
export const BASE_URL = "https://api.moonshot.cn/v1"; // ← 官方指定，包含 /v1
export const MODEL = "kimi-k2-turbo-preview"; // ← 官方推荐模型

export const API_CONFIG = {
  url: `${BASE_URL}/chat/completions`, // ← 完整路径
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`
  },
  requestBodyTemplate: {
    model: MODEL,
    messages: [],
    max_tokens: 1000,
    temperature: 0.7,
    top_p: 0.95,
    stream: false
  }
};

export const TEST_REQUEST = {
  url: `${BASE_URL}/chat/completions`,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`
  },
  body: {
    model: MODEL,
    messages: [{ role: "user", content: "你好" }],
    max_tokens: 10
  }
};