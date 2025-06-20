'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddProductForm from '@/components/shared/AddProductForm';
import ProductTable from '@/components/shared/ProductTable';
import { Product, ProductStatus } from '../../../typings';
import AddPromoCodeDialog from './AddPromoCodeForm';
import { Button } from '../ui/button';
import Link from 'next/link';

const statusMap: Record<ProductStatus, string> = {
  ACTIVE: 'Активно',
  INACTIVE: 'Неактивно',
};

const reverseStatusMap: Record<string, ProductStatus> = {
  'Активно': 'ACTIVE',
  'Неактивно': 'INACTIVE',
};

export default function AdminPageContent({ products }: { products: Product[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get('status') as ProductStatus | null;

  const activeTab = statusParam ? statusMap[statusParam] : 'Все';

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    const status = reverseStatusMap[value];
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }

    router.push(`/admin?${params.toString()}`);
  };

  const getFiltered = (tab: string) => {
    const status = reverseStatusMap[tab];
    return status ? products.filter(p => p.status === status) : products;
  };

  return (
    <main className="p-12 max-sm:p-2 space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:space-y-2">
          <TabsList className="bg-muted p-1 rounded-md">
            <TabsTrigger value="Все" className="px-4 py-2 cursor-pointer">ВСЕ</TabsTrigger>
            <TabsTrigger value="Активно" className="px-4 py-2 cursor-pointer">Активно</TabsTrigger>
            <TabsTrigger value="Неактивно" className="px-4 py-2 cursor-pointer">Неактивно</TabsTrigger>
          </TabsList>
          <div className='space-x-2'>
          <Button asChild>
            <Link href="/admin/promocodes" className="cursor-pointer">
            Управление промокодами
            </Link>
          </Button>
          <AddProductForm/>
          </div>
        </div>

        {['Все', 'Активно', 'Неактивно'].map(tab => {
          const filtered = getFiltered(tab);
          return (
            <TabsContent key={tab} value={tab}>
              {filtered.length > 0 ? (
                <ProductTable products={filtered} />
              ) : (
                <div className="text-muted-foreground text-center py-8 text-sm">
                  Нет товаров
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </main>
  );
}
