// lib/proxyFetcher.ts
import { HttpsProxyAgent } from "https-proxy-agent";

const proxyUrl =
  "http://brd-customer-hl_ad40ad66-zone-residential_proxy1:h6th01nm8syj@brd.superproxy.io:33335";

const agent = new HttpsProxyAgent(proxyUrl);

export const proxiedFetch = (url: string, options: any = {}) => {
  return fetch(url, {
    ...options,
    agent,
  });
};
