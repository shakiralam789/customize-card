/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/invitations",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
