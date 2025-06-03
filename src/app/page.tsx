import ProductCard from "@/components/shared/ProductCard";
import { auth } from "../../auth";
import { redirect } from "next/navigation";
import { getAllProducts } from "@/actions/products.action";

export default async function Home() {
  const session = await auth();
  const products = await getAllProducts();
  if (!session) redirect("/sign-in");
  return (
    <main className="">

      <div className="grid grid-cols-7">
      {products?.map((product) => (
        <ProductCard key={product?.id} product={product}/>
      ))}
      </div>
    </main>
  );
}
