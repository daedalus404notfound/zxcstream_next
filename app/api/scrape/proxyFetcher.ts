import { HttpsProxyAgent } from "https-proxy-agent";

// Bright Data config (replace with your values)
const PROXY_HOST = "brd.superproxy.io";
const PROXY_PORT = 33335;
const PROXY_USERNAME = "brd-customer-hl_ad40ad66-zone-residential_proxy1";
const PROXY_PASSWORD = "h6th01nm8syj";

const proxyUrl = `http://${PROXY_USERNAME}:${PROXY_PASSWORD}@${PROXY_HOST}:${PROXY_PORT}`;

// Create a proxied fetch (handles both HTTP/HTTPS)
// Proxied fetch (with type assertion to satisfy TS)
export const proxiedFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const agent = new HttpsProxyAgent(proxyUrl);
  return fetch(input, { ...init, agent } as any);
};
