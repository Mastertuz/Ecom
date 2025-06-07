import { getAllProducts } from '@/actions/products.action';
import AdminPageContent from '@/components/shared/AdminPageContent';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { auth } from '../../../../auth';

declare module 'next-auth' {
  interface User {
    role?: string;
  }
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const session = await auth()
  if (session?.user?.role !== 'admin') return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">Доступ запрещен</h1>
      <p className="text-center">У вас нет прав для доступа к этой странице.</p>
      <Button className="mt-4" asChild>
        <Link href="/" className="cursor-pointer">
          Вернуться на главную
        </Link>
      </Button>
    </div>
  );
  const products = await getAllProducts();
  
  const status = searchParams?.status || '';
  
  return <AdminPageContent products={products} />;
}