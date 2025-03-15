import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    serverExternalPackages: [
        'bcrypt',
    ]
};

export default nextConfig;
