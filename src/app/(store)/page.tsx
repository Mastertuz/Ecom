import ProductCard from "@/components/shared/ProductCard"
import { getAllProducts } from "@/actions/products.action"
import SaleBanner from "@/components/shared/SaleBanner"
import CategoryFilter from "@/components/shared/CategoryFilter"

interface HomeProps {
  searchParams: Promise<{ category?: string }>
}

export default async function Home({ searchParams }: HomeProps) {

  const resolvedSearchParams = await searchParams
  const selectedCategory = resolvedSearchParams.category
  const products = await getAllProducts(selectedCategory)

  return (
    <>
      <SaleBanner />
      <div className="container mx-auto my-10">
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2 sm:text-xl">Товары по категориям</h1>
            <p className="text-gray-300 ">
              {selectedCategory && selectedCategory !== "Все"
                ? `Категория: ${selectedCategory.replace("_", " и ")}`
                : "Все категории"}{" "}
              • {products.length} товаров
            </p>
          </div>
          <CategoryFilter />
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">В данной категории товары не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {products?.map((product) => (
              <ProductCard key={product?.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}


