const ALLOWED_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "www.youtu.be",
  "ytimg.com",
  "i.ytimg.com",
  "googlevideo.com",
]);

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Range, Accept, Accept-Encoding",
  "Access-Control-Expose-Headers": "Content-Length, Content-Range, Accept-Ranges, Content-Type",
};

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const targetUrlStr = url.searchParams.get("url");

    if (!targetUrlStr) {
      return new Response("Missing 'url' parameter", { status: 400, headers: CORS_HEADERS });
    }

    let targetUrl;
    try {
      targetUrl = new URL(targetUrlStr);
    } catch (e) {
      return new Response("Invalid 'url' parameter format", { status: 400, headers: CORS_HEADERS });
    }

    const hostname = targetUrl.hostname.toLowerCase();
    
    // Strict Host Validation
    const isAllowedHost = ALLOWED_HOSTS.has(hostname) || hostname.endsWith(".googlevideo.com");
    if (!isAllowedHost) {
      return new Response("Invalid URL. Host not allowed.", { status: 403, headers: CORS_HEADERS });
    }

    // Determine architectural route
    const routeType = url.pathname.replace(/\/$/, ""); // e.g., /api/page, /api/thumb, /api/media, /api/api

    // AbortController for explicit timeout (15s)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); 

    try {
      const fetchHeaders = new Headers();
      
      // Selectively forward headers based on the endpoint type
      if (routeType === "/api/caption") {
        const range = request.headers.get("Range");
        if (range) fetchHeaders.set("Range", range);
        
        const safeHeaders = ["Accept", "Accept-Encoding", "User-Agent"];
        for (const h of safeHeaders) {
          if (request.headers.has(h)) fetchHeaders.set(h, request.headers.get(h));
        }
      } else {
        // For /api/page or /api/api, we use a standard Android User-Agent.
        // Reason: Desktop UAs often get 429 from Datacenter IPs, and Googlebot UAs get 'UNPLAYABLE' for music videos.
        // Mobile UAs are often treated more leniently by YouTube's rate limiting.
        fetchHeaders.set("User-Agent", "Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36");
        fetchHeaders.set("Accept-Language", "en-US,en;q=0.9");
        if (request.headers.has("Content-Type")) fetchHeaders.set("Content-Type", request.headers.get("Content-Type"));
      }

      if (request.method !== "GET" && request.method !== "HEAD" && request.method !== "POST") {
         return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
      }

      const response = await fetch(targetUrl.toString(), {
        method: request.method,
        headers: fetchHeaders,
        body: request.method === "POST" ? await request.arrayBuffer() : null,
        redirect: "follow",
        signal: controller.signal,
      });

      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "YOUTUBE_RATE_LIMITED",
            message: "YouTube returned a traffic verification challenge. The upstream request cannot be completed from this proxy.",
          }),
          {
            status: 429,
            headers: {
              ...CORS_HEADERS,
              "Content-Type": "application/json",
              "Retry-After": response.headers.get("Retry-After") || "60",
            },
          }
        );
      }

      const proxyHeaders = new Headers(CORS_HEADERS);
      
      // Selectively preserve safe upstream headers
      const headersToPreserve = [
        "Content-Type", "Content-Length", "Content-Range", 
        "Accept-Ranges", "Cache-Control", "ETag", "Last-Modified"
      ];
      
      for (const h of headersToPreserve) {
        if (response.headers.has(h)) {
          proxyHeaders.set(h, response.headers.get(h));
        }
      }

      // Deliberate caching strategy
      if (routeType === "/api/thumb") {
        proxyHeaders.set("Cache-Control", "public, max-age=86400"); // cache thumbs for 1 day
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: proxyHeaders,
      });
      
    } catch (error) {
      if (error.name === "AbortError") {
        return new Response("Proxy Error: Upstream request timed out.", { status: 504, headers: CORS_HEADERS });
      }
      return new Response("Proxy Error: Failed to fetch upstream resource.", { status: 500, headers: CORS_HEADERS });
    } finally {
      clearTimeout(timeout);
    }
  },
};
