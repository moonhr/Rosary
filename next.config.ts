// import type { NextConfig } from "next";

import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // dev 모드에서는 PWA 비활성화
});

export default nextConfig;
