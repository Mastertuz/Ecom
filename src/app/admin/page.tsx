import { createProduct, getAllProducts } from '@/actions/products.action';
import AddProductForm from '@/components/shared/AddProductForm';
import ProductTable from '@/components/shared/ProductTable';


export default async function AdminPage() {
  const products = await getAllProducts();

  return (
    <main className="p-12">
      <AddProductForm/>
      <ProductTable products={products} />
    </main>
  );
}
