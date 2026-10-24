import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ik.imagekit.io'
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com'
            }
        ],
    }
};

export default nextConfig;

