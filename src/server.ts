import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (record.count >= limit) {
    return false;
  }
  record.count += 1;
  return true;
}

function applySecurityHeaders(response: Response): Response {
  const newHeaders = new Headers(response.headers);

  // Prevent MIME-type sniffing attacks
  newHeaders.set("X-Content-Type-Options", "nosniff");

  // Prevent Clickjacking via iframes
  newHeaders.set("X-Frame-Options", "SAMEORIGIN");

  // Enable legacy browser XSS filters
  newHeaders.set("X-XSS-Protection", "1; mode=block");

  // Protect sensitive query strings and tokens in referrers
  newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Restrict sensitive device APIs
  newHeaders.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(self 'https://*.cashfree.com')",
  );

  // Prevent window.opener cross-origin tampering while allowing payment modals
  newHeaders.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");

  // Restrict resource loading across origins
  newHeaders.set("X-Permitted-Cross-Domain-Policies", "none");

  // Force HTTPS on modern browsers
  newHeaders.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

  // Robust Content Security Policy allowing required assets, Cashfree, Razorpay, Google OAuth, and Supabase
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.cashfree.com https://sdk.cashfree.com https://checkout.razorpay.com https://accounts.google.com https://apis.google.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' https://fonts.gstatic.com data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.cashfree.com https://sandbox.cashfree.com https://api.cashfree.com https://sdk.cashfree.com https://payments.cashfree.com https://api.razorpay.com https://lumberjack.razorpay.com https://accounts.google.com https://images.unsplash.com",
    "frame-src 'self' https://*.cashfree.com https://sandbox.cashfree.com https://api.cashfree.com https://sdk.cashfree.com https://payments.cashfree.com https://api.razorpay.com https://checkout.razorpay.com https://accounts.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://*.cashfree.com https://api.cashfree.com https://payments.cashfree.com https://sandbox.cashfree.com",
  ];
  newHeaders.set("Content-Security-Policy", cspDirectives.join("; "));

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

import { createCashfreeOrderBackend, verifyCashfreeOrderBackend } from "./lib/cashfree-api";
import { validateOrderIntegrity } from "./lib/security";

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      const clientIp =
        request.headers.get("cf-connecting-ip") ||
        request.headers.get("x-real-ip") ||
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        "anonymous";

      // 1. Rate-Limited Cashfree Order Creation Endpoint (Anti-Spam / Anti-DDoS)
      if (url.pathname === "/api/cashfree/create-order" && request.method === "POST") {
        if (!checkRateLimit(`create_${clientIp}`, 10, 60 * 1000)) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Rate limit exceeded. Please wait 1 minute before trying again.",
            }),
            {
              status: 429,
              headers: { "Content-Type": "application/json", "Retry-After": "60" },
            },
          );
        }

        try {
          const body = await request.json();

          // Anti-tampering validation
          const integrity = validateOrderIntegrity({
            amount: Number(body.amount),
          });
          if (!integrity.isValid) {
            return new Response(JSON.stringify({ success: false, error: integrity.error }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const result = await createCashfreeOrderBackend(body);
          return new Response(JSON.stringify(result), {
            status: result.success ? 200 : 400,
            headers: { "Content-Type": "application/json" },
          });
        } catch (e) {
          return new Response(
            JSON.stringify({ success: false, error: "Invalid payment request payload." }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      }

      // 2. Rate-Limited Cashfree Order Verification Endpoint
      if (url.pathname === "/api/cashfree/verify-order" && request.method === "GET") {
        if (!checkRateLimit(`verify_${clientIp}`, 90, 60 * 1000)) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Verification rate limit reached. Retrying automatically...",
            }),
            {
              status: 429,
              headers: { "Content-Type": "application/json", "Retry-After": "5" },
            },
          );
        }

        try {
          const orderId = (url.searchParams.get("orderId") || "").slice(0, 50);
          const result = await verifyCashfreeOrderBackend(orderId);
          return new Response(JSON.stringify(result), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch {
          return new Response(
            JSON.stringify({ success: false, error: "Failed to verify transaction status." }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      return applySecurityHeaders(normalized);
    } catch (error) {
      console.error("Server fetch exception:", error);
      const errorResp = new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
      return applySecurityHeaders(errorResp);
    }
  },
};
