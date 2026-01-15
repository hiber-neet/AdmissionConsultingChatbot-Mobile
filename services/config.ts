export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://34.158.58.188:8000";

export const WS_BASE_URL = API_BASE_URL
  .replace(/^https:\/\//, "wss://")
  .replace(/^http:\/\//, "ws://");