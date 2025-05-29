'use client';

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
import { createProduct } from '@/actions/products.action';
import { ProductCreateInput } from '../../../typings';

const productSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Цена должна быть положительной'),
  imageUrl: z.string().url('Введите корректный URL изображения'),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProductForm() {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      imageUrl: '',
      price: 0,
    },
  });


    const onSubmit = async (data: ProductCreateInput) => {
    try {
      const product = await createProduct(data); // ✅ безопасный вызов server action
      console.log('Создан продукт:', product);
      form.reset();
    } catch (err) {
      console.error('Ошибка при создании:', err);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 border p-6 rounded-xl shadow max-w-xl"
      >
        <h2 className="text-2xl font-semibold">Добавление товара</h2>

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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea placeholder="Описание товара (необязательно)" {...field} />
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
                <Input type='number'

                className='appearance-none' placeholder="Введите цену" {...field} />
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

        <Button className='cursor-pointer'  type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Добавление...' : 'Добавить товар'}
        </Button>
      </form>
    </Form>
  );
}
