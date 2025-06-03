import Image from "next/image";
import { Product } from "../../../typings";
import Link from "next/link";

type Props = {
  product: Product;
};
function ProductCard({ product }: Props) {
  return (
    <Link href={""} className="border w-[220px] h-[240px] border-white p-4 rounded-[40px] transition-all duration-200 ease-in-out shadow-sm hover:shadow-md overflow-hidden group flex flex-col shadow-gray-300">
      <div className="relative aspect-square size-full overflow-hidden">
        <Image
          className="object-contain transition-transform duration-300 group-hover:scale-105"
          src={product?.imageUrl || ""}
          alt="Product img"
          width={220}
          height={200}
        />
        <div className="p-4 text-center">
        <h2 className="text-lg font-semibold text-white truncate">
          {product.name}
        </h2>

        <p className="mt-2 text-sm text-white font-extrabold">
        ${product.price}
        </p>
      </div>
      </div>
    </Link>
  );
}

export default ProductCard;
