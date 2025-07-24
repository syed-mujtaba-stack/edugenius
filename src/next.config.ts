import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbopack: {
      resolveExtensions: [
        '.native.tsx',
        '.native.ts',
        '.native.jsx',
        '.native.js',
        '.tsx',
        '.ts',
        '.jsx',
        '.js',
        '.mjs',
        '.json',
      ],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mujtaba-mj.vercel.app',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'portfolio-nine-ebon-36.vercel.app',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
