import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[new URL('https://api.removal.ai/download/g3/preview/**')]
  }

};

export default nextConfig;
