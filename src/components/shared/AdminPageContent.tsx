'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddProductForm from '@/components/shared/AddProductForm';
import ProductTable from '@/components/shared/ProductTable';
import { Product } from '../../../typings';

export default function AdminPageContent({ products }: { products: Product[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  const activeTab =
    status === 'active'
      ? 'Активно'
      : status === 'inactive'
        ? 'Неактивно'
        : 'ВСЕ';

  const getFiltered = (tab: string) => {
    if (tab === 'ВСЕ') return products;
    return products.filter(product => product.status === tab);
  };

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const newStatus =
      value === 'Активно'
        ? 'active'
        : value === 'Неактивно'
          ? 'inactive'
          : '';

    if (newStatus) {
      params.set('status', newStatus);
    } else {
      params.delete('status');
    }

    router.push(`/admin?${params.toString()}`);
  };

  return (
    <main className="p-12 space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex items-center justify-between">
          <TabsList className="bg-muted p-1 rounded-md">
            <TabsTrigger value="ВСЕ" className="px-4 py-2 cursor-pointer">
              ВСЕ
            </TabsTrigger>
            <TabsTrigger value="Активно" className="px-4 py-2 cursor-pointer">
              Активно
            </TabsTrigger>
            <TabsTrigger value="Неактивно" className="px-4 py-2 cursor-pointer">
              Неактивно
            </TabsTrigger>
          </TabsList>
          <AddProductForm />
        </div>

        {['ВСЕ', 'Активно', 'Неактивно'].map(tab => {
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
