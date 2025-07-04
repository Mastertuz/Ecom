'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Product, ProductStatus, Category } from '../../../typings';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { EditProductDialog } from './EditProductForm';
import { toast } from 'sonner';

type Props = {
  products: Product[];
};

const statusLabels: Record<ProductStatus, string> = {
  ACTIVE: 'Активно',
  INACTIVE: 'Неактивно',
};

const categoryLabels: Record<Category, string> = {
  SNEAKERS: 'Кроссовки',
  POLO: 'Поло',
  HOODIES: 'Толстовки',
  SHOES: 'Кеды',
  ACCESSORIES: 'Аксессуары',
};

export default function ProductTable({ products }: Props) {
  const router = useRouter();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('ID скопирован в буфер обмена');
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        toast.success('Товар успешно удалён');
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || 'Не удалось удалить товар');
      }
    } catch (err) {
      console.error('Ошибка при удалении:', err);
      toast.error('Произошла ошибка при удалении товара.');
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Изображение</TableHead>
          <TableHead>Название</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead>Цена</TableHead>
          <TableHead>Обновлено</TableHead>
          <TableHead>Действия</TableHead>
          <TableHead>Категория</TableHead>
          <TableHead>Количество</TableHead>
          <TableHead>ID</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <Image
                src={product.imageUrl || '/fallback.png'}
                alt={product.name}
                width={128}
                height={96}
                className="w-32 h-24 object-contain rounded"
              />
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                  product.status === 'ACTIVE'
                    ? 'bg-green-500 text-black ring-green-600/20'
                    : 'bg-red-500 text-black ring-gray-600/20'
                }`}
              >
                {statusLabels[product.status]}
              </span>
            </TableCell>
            <TableCell className="font-semibold">{product.price} ₽</TableCell>
            <TableCell>{new Date(product.updatedAt).toLocaleDateString()}</TableCell>
            <TableCell className="space-x-2">
              <EditProductDialog product={product} />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="link" className="text-red-600">
                    Удалить
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Удалить товар «{product.name}»?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Это действие нельзя отменить. Товар будет удалён навсегда.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(product.id)}>
                      Удалить
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
            <TableCell>{categoryLabels[product.category]}</TableCell>
            <TableCell>{product.stock}</TableCell>
            <TableCell
              onClick={() => copyToClipboard(product.id)}
              className="cursor-pointer hover:text-blue-600"
            >
              {product.id}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
