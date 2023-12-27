/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/pages/login',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig
