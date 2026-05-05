import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        inlineCss: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 31536000,
    },
};

export default nextConfig;
