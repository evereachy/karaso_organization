import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/autoservice",
  env: {
    NEXT_PUBLIC_BASE_PATH: "/autoservice",
  },
  images: {
    // Демо-картинки. Для продакшена заменить на свой CDN / /public.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
