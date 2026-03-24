import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/organizador-cadeiras',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;