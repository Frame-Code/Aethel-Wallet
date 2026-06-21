/** @type {import('next').NextConfig} */
const nextConfig = {
  // PWA y optimizaciones se configuran aquí
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
