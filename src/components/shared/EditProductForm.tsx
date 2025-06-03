'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Product } from '../../../typings';
import { updateProduct } from '@/actions/products.action';
import { useRef } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
const productSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Цена должна быть положительной'),
  imageUrl: z.string().url('Введите корректный URL изображения'),
  stock: z.coerce.number().min(1, "Количество не может быть меньше 1"),
  status: z.enum(["Активно", "Неактивно"]),
});

type ProductFormData = z.infer<typeof productSchema>;

type Props = {
  product: Product;
};

export default function EditProductDialog({ product }: Props) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      price: product.price,
      stock:product.stock,
      status:product.status
    },
  });
  const closeRef = useRef<HTMLButtonElement>(null);

  const onSubmit = async (data: ProductFormData) => {
    try {
      await updateProduct(product.id, data);
      closeRef.current?.click();
    } catch (err) {
      console.error('Ошибка при обновлении товара:', err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-blue-600">
          Изменить
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Редактировать товар</DialogTitle>
          <DialogDescription>
            Обновите информацию и нажмите "Сохранить".
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите название товара" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Статус</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите статус" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Активно">Активно</SelectItem>
                      <SelectItem value="Неактивно">Неактивно</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Описание товара" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цена</FormLabel>
                  <FormControl>
                    <Input type="number" className="appearance-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Количество</FormLabel>
                  <FormControl>
                    <Input type="number" className="appearance-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ссылка на изображение</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Сохранение...' : 'Сохранить'}
              </Button>
              <DialogClose asChild>
                <button type="button" ref={closeRef} className="hidden" />
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
