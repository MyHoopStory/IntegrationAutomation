/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:5001/:path*', // Proxy to Flask
      },
    ];
  },
};

export default nextConfig;
