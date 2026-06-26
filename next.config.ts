import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // outputFileTracingRoot: path.resolve(__dirname, '../../'),  // Uncomment and add 'import path from "path"' if needed
  /* config options here */
  allowedDevOrigins: ['*.dev.coze.site'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        pathname: '/**',
      },
    ],
  },
  // 允许在API路由中使用Node.js的fs模块
  serverExternalPackages: [],
  experimental: {
    serverActions: {
      allowedOrigins: ['*.dev.coze.site'],
    },
  },
};

export default nextConfig;
