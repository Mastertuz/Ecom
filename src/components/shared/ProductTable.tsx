'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Product } from '../../../typings';
import { useRouter } from 'next/navigation';

type Props = {
  products: Product[];
};

export default function ProductTable({ products }: Props) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Вы уверены, что хотите удалить этот товар?');
    if (!confirmed) return;

    try {
      const res = await fetch('/api/products', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        router.refresh(); // Обновить список после удаления
      } else {
        let errorMessage = 'Не удалось удалить товар';
        try {
          const data = await res.json();
          errorMessage = data?.error || errorMessage;
        } catch {
          // тело может быть пустым
        }
        alert(`Ошибка: ${errorMessage}`);
      }
    } catch (err) {
      console.error('Ошибка при удалении:', err);
      alert('Произошла ошибка при удалении товара.');
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
          <TableHead>ID</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <img
                src={product.imageUrl ?? '/default-image.png'}
                alt={product.name}
                className="w-32 h-24 object-cover rounded"
              />
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                  product.status === 'Активно'
                    ? 'bg-green-500 text-black ring-green-600/20'
                    : 'bg-red-500 text-black ring-gray-600/20'
                }`}
              >
                {product.status}
              </span>
            </TableCell>
            <TableCell className="font-semibold">
              ${product.price.toFixed(2)}
            </TableCell>
            <TableCell>
              {new Date(product.updatedAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="space-x-2">
              <Button
                variant="link"
                className="text-blue-600"
                onClick={() =>
                  console.log(`Редактировать товар с ID: ${product.id}`)
                }
              >
                Изменить
              </Button>
              <Button
                variant="link"
                className="text-red-600"
                onClick={() => handleDelete(product.id)}
              >
                Удалить
              </Button>
            </TableCell>
            <TableCell>{product.id}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
