// export const localhostSpoofFetch: typeof fetch = (input, init) => {
//   const headers = new Headers(init?.headers);

//   const ua = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36`;

//   headers.set("User-Agent", ua);
//   headers.set("Host", "localhost:3000"); // ← Magic line #1
//   headers.set("X-Forwarded-For", "127.0.0.1"); // ← Magic line #2
//   headers.set("Sec-Fetch-Site", "none"); // ← Makes it look direct
//   headers.set(
//     "sec-ch-ua",
//     `"Google Chrome";v="131", "Chromium";v="131", "Not=A?Brand";v="8"`
//   );
//   headers.set("sec-ch-ua-mobile", "?0");
//   headers.set("sec-ch-ua-platform", `"Windows"`);
//   headers.set(
//     "Accept",
//     "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
//   );
//   headers.set("Upgrade-Insecure-Requests", "1");

//   return fetch(input, {
//     ...init,
//     headers,
//     signal: init?.signal ?? AbortSignal.timeout(28_000),
//   });
// };
