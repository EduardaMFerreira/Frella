import { createProxyMiddleware } from "http-proxy-middleware";

export function createServiceProxy(target: string) {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    logLevel: "debug"
  });
}