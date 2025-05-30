'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddProductForm from '@/components/shared/AddProductForm';
import ProductTable from '@/components/shared/ProductTable';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '../../../typings';

export default function AdminPageContent({
  searchParams,
  products,
}: {
  searchParams: { status?: string };
  products: Product[];
}) {
  const router = useRouter();
  const searchParamsClient = useSearchParams();
  const statusParam = searchParams?.status || searchParamsClient.get('status') || '';
  const activeTab = 
    statusParam === 'active' 
      ? 'Активно' 
      : statusParam === 'inactive' 
        ? 'Неактивно' 
        : 'ВСЕ';

  const filteredProducts = products.filter(product => {
    if (activeTab === 'ВСЕ') return true;
    return product.status === activeTab;
  });

  const handleTabChange = (value: string) => {
    const status = 
      value === 'ВСЕ' 
        ? '' 
        : value === 'Активно' 
          ? 'active' 
          : 'inactive';
          
    const params = new URLSearchParams(window.location.search);
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    router.push(`/admin?${params.toString()}`);
  };

  return (
    <main className="p-12 space-y-6">
      <Tabs 
        defaultValue={activeTab} 
        value={activeTab}
        onValueChange={handleTabChange}
      >
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
            <AddProductForm/>
        </div>
        <TabsContent value="ВСЕ">
          <ProductTable products={activeTab === 'ВСЕ' ? filteredProducts : []} />
        </TabsContent>
        <TabsContent value="Активно">
          <ProductTable products={activeTab === 'Активно' ? filteredProducts : []} />
        </TabsContent>
        <TabsContent value="Неактивно">
          <ProductTable products={activeTab === 'Неактивно' ? filteredProducts : []} />
        </TabsContent>
      </Tabs>      
  
    </main>
  );
}