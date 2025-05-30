import { getAllProducts } from '@/actions/products.action';
import AdminPageContent from '@/components/shared/AdminPageContent';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const products = await getAllProducts();
  
  const status = searchParams?.status || '';
  
  return <AdminPageContent searchParams={{ status }} products={products} />;
}