// sw.js (put in /public/sw.js)
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // Detect any request to premilkyway / streamwish / filelions
  if (
    url.includes("premilkyway.com") ||
    url.includes("streamwish.") ||
    url.includes("filelions.")
  ) {
    const fakeHeaders = new Headers(event.request.headers);
    fakeHeaders.set("Referer", "https://yuguaab.com/e/z5wpw8ddtoqc");
    fakeHeaders.set("Origin", "https://yuguaab.com");

    event.respondWith(
      fetch(event.request, {
        headers: fakeHeaders,
        referrer: "https://yuguaab.com/e/z5wpw8ddtoqc",
        referrerPolicy: "unsafe-url",
        mode: "cors",
        credentials: "omit",
      })
    );
  }
});
