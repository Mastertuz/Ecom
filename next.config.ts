import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[
      new URL('https://utfs.io/f/**'),
    ]
  }

};

export default nextConfig;
