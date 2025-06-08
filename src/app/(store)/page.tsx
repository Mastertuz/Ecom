import ProductCard from "@/components/shared/ProductCard";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { getAllProducts } from "@/actions/products.action";
import SaleBanner from "@/components/shared/SaleBanner";

export default async function Home() {
  const session = await auth();
  const products = await getAllProducts();
  if (!session) redirect("/sign-in");
  return (
    <main className="">
      <SaleBanner />
      <div className="max-w-[1536px] mx-auto my-10">
        <div className="grid grid-cols-2 max-[380px]:grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {products?.map((product) => (
            <ProductCard key={product?.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
