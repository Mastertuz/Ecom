import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[new URL('https://api.removal.ai/download/**'),new URL('https://img.vitkac.com/**'),
      new URL('https://sidekicks.co.uk/cdn/shop/files/1070733_00_png.png?v=1721844056'),
      new URL('https://www.casio.com/content/dam/casio/product-info/locales/my/en/timepiece/product/watch/G/GA/GA2/GA-2100-1A/assets/GA-2100-1A_Seq1.png.transform/main-visual-sp/image.png'),
      new URL('https://sneakersstore.pl/cdn/shop/files/adidas-campus-00s-yellow-1_2000x_1df6ca6a-c3d3-4e80-b645-b212d9fb30e6.png?v=1686436878'),
      new URL('https://p7.hiclipart.com/preview/853/903/696/hoodie-jacket-diesel-sweater-clothing-polo-shirt.jpg'),
      new URL('https://images.footlocker.com/is/image/EBFL2/74002443_05?wid=500&hei=500&fmt=png-alpha')
      ,new URL('https://images.footlocker.com/is/image/EBFL2/45425004_01?wid=500&hei=500&fmt=png-alpha'),
      new URL('https://images.footlocker.com/is/image/EBFL2/18347031_01?wid=500&hei=500&fmt=png-alpha'),
      new URL('https://padelproshop.com/cdn/shop/files/746854607_max-1.png?v=1694780605&width=640'),
      new URL('https://heppo.com/cdn/shop/products/59045-01.png?v=1704796242'),
      new URL('https://heppo.com/cdn/shop/files/60076-61_d0aec0c5-ca77-4f26-a231-794e3141376f.png?v=1717938117&width=1080'),
      new URL('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5ee-t5J-w6YE0PrGmMOOEJFfbxPHQ49pjJQ&s'),
      new URL('https://usmall.ru/image/663/36/84/e90e3d08125be0d8869f6e3ea99ac93b.png'),
      new URL('https://ir.ebaystatic.com/pictures/aw/pics/sneakers/s_l1600_1e0878d98b.png'),
      new URL('https://upa5pze5li.ufs.sh/**')
    ]
  }

};

export default nextConfig;
