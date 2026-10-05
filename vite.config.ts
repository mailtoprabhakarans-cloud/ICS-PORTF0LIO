import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";
import { createCashfreeOrderBackend, verifyCashfreeOrderBackend } from "./src/lib/cashfree-api";
import { validateOrderIntegrity } from "./src/lib/security";

function cashfreeDevPlugin(): Plugin {
  return {
    name: "cashfree-dev-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === "/api/cashfree/create-order" && req.method === "POST") {
          let bodyStr = "";
          req.on("data", (chunk: Buffer) => {
            bodyStr += chunk.toString();
          });
          req.on("end", async () => {
            try {
              const body = JSON.parse(bodyStr || "{}");
              const integrity = validateOrderIntegrity({
                amount: Number(body.amount),
              });
              if (!integrity.isValid) {
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, error: integrity.error }));
                return;
              }

              const result = await createCashfreeOrderBackend(body);
              res.setHeader("Content-Type", "application/json");
              res.statusCode = result.success ? 200 : 400;
              res.end(JSON.stringify(result));
            } catch {
              res.setHeader("Content-Type", "application/json");
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: "Invalid payment request payload." }));
            }
          });
          return;
        }

        if (req.url?.startsWith("/api/cashfree/verify-order") && req.method === "GET") {
          try {
            const url = new URL(req.url, "http://localhost");
            const orderId = (url.searchParams.get("orderId") || "").slice(0, 50);
            const result = await verifyCashfreeOrderBackend(orderId);
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.end(JSON.stringify(result));
          } catch {
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: "Failed to verify transaction status." }));
          }
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [cashfreeDevPlugin()],
  },
});
