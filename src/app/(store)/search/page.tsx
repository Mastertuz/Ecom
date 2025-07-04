import { getProductsByName } from "@/actions/products.action";
import ProductCard from "@/components/shared/ProductCard";

async function Searchpage({
  searchParams,
}: {
  searchParams: Promise<{
    query: string;
  }>;
}) {
  const { query } = await searchParams;
  const products = await getProductsByName(query);

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-top min-h-screen container">
        <div className="p-8 rounded-lg shadow-md w-full max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Товары по запросу: {query} не найдены
          </h1>
          <p className="text-gray-600 text-center">
            Попробуйте поискать другой товар
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto ">
      <h1 className="text-3xl font-bold mb-12 text-center text-white">
        Товары по запросу : {query}
      </h1>
      <div className="grid grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {products?.map((product) => (
          <ProductCard key={product?.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Searchpage;
