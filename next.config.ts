// types are inferred — no need to explicitly type baseConfig
import withPWA from 'next-pwa';

const baseConfig = {
  distDir: 'build',
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
  images: {
    remotePatterns: [
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
    ].map(p => ({ ...p })),
  },
  experimental: {
    serverActions: {},
  },
};

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})(baseConfig);
