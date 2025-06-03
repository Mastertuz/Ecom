import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[new URL('https://api.removal.ai/download/**')]
  }

};

export default nextConfig;
