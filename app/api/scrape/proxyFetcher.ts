import { HttpsProxyAgent } from "https-proxy-agent";

// Bright Data config (replace with your values)
const PROXY_HOST = "brd.superproxy.io";
const PROXY_PORT = 33335;
const PROXY_USERNAME = "brd-customer-hl_ad40ad66-zone-residential_proxy1";
const PROXY_PASSWORD = "h6th01nm8syj";

export const proxiedFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit
) => {
  const SESSION = "philipssausage";
  const proxyUrl = `http://${PROXY_USERNAME}-session-${SESSION}:${PROXY_PASSWORD}@${PROXY_HOST}:${PROXY_PORT}`;
  const agent = new HttpsProxyAgent(proxyUrl);
  return fetch(input, { ...init, agent } as any);
};
