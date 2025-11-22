// proxyFetcher.ts
import { HttpsProxyAgent } from "https-proxy-agent";
const SESSION_ID = Math.floor(Math.random() * 999999);
const PROXY_HOST = "brd.superproxy.io";
const PROXY_PORT = 33335;
const PROXY_USERNAME = `brd-customer-hl_ad40ad66-zone-residential_proxy1-session-${SESSION_ID}`;
const PROXY_PASSWORD = "h6th01nm8syj";

const proxyUrl = `http://${PROXY_USERNAME}:${PROXY_PASSWORD}@${PROXY_HOST}:${PROXY_PORT}`;
const agent = new HttpsProxyAgent(proxyUrl);

// Real Chrome 127+ headers (update monthly)
const REAL_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-User": "?1",
  "Sec-Fetch-Dest": "document",
  "Upgrade-Insecure-Requests": "1",
  Priority: "u=0, i",
};

export const proxiedFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit
) => {
  const url = typeof input === "string" ? input : input.toString();

  // Critical: inject headers on EVERY request
  const headers = new Headers(init?.headers || {});

  // Merge real headers (override if needed)
  Object.entries(REAL_HEADERS).forEach(([k, v]) => {
    headers.set(k, v);
  });

  // Some CDNs check Referer/Origin strictly
  if (url.includes("samui390dod.com") || url.includes("rgshows")) {
    headers.set("Referer", "https://www.rgshows.ru/");
    headers.set("Origin", "https://www.rgshows.ru");
  }

  return fetch(input, {
    ...init,
    agent,
    headers,
    // Critical for many anti-bot systems
    cache: "no-store",
    redirect: "follow",
  } as any);
};
