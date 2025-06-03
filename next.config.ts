import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[new URL('https://api.removal.ai/download/**'),new URL('https://img.vitkac.com/**'),
      new URL('https://sidekicks.co.uk/cdn/shop/files/1070733_00_png.png?v=1721844056'),
      new URL('https://e7.pngegg.com/pngimages/708/411/png-clipart-master-of-g-g-shock-gpw-1000-watch-casio-g-shock-watch-accessory-brand.png'),
      new URL('https://sneakersstore.pl/cdn/shop/files/adidas-campus-00s-yellow-1_2000x_1df6ca6a-c3d3-4e80-b645-b212d9fb30e6.png?v=1686436878')
    ]
  }

};

export default nextConfig;
