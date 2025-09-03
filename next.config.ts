import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const baseConfig: NextConfig = {
  reactStrictMode: true,

  compiler: {
    removeConsole: process.env.NODE_ENV !== 'development',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Handle Webpack 5 compatibility with vm2 and Handlebars
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      child_process: false,
      dns: 'mock',
      dgram: 'empty',
      zlib: 'empty',
      http2: 'empty',
      process: false,
    };

    // Ignore specific warnings
    config.ignoreWarnings = [
      { module: /node_modules\/handlebars/ },
      { file: /node_modules\/vm2/ },
    ];

    // Add externals for vm2
    config.externals = [...(config.externals || []), 'vm2'];

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: 'mujtaba-mj.vercel.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: 'portfolio-nine-ebon-36.vercel.app',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      // Configure server actions options
      bodySizeLimit: '2mb',
    },
    // Disable Next.js dev tools to prevent React Server Components bundler errors
    turbo: {
      // Disable devtools that cause module resolution issues
    },
  } as const,
};

export default (withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
}) as any)(baseConfig);
