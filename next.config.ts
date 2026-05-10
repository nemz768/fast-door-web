import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  productionBrowserSourceMaps: false, // отключаем source maps
  output: "standalone", // для оптимизации сборки
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // убираем логи для продакшена
  },
};

export default nextConfig;
