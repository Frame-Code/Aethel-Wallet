import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // PWA y optimizaciones se configurarán aquí
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };
    return config;
  }
}

export default nextConfig
