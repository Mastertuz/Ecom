'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRef } from 'react';
import { createPromoCode } from '@/actions/promocode.actions';

const promoSchema = z.object({
  code: z.string().min(1, 'Код обязателен'),
  discount: z.coerce.number().int().min(1, 'Минимум 1%').max(100, 'Максимум 100%'),
  expiresAt: z
    .string()
    .optional()
    .refine(
      (date) => !date || !isNaN(Date.parse(date)),
      'Введите корректную дату окончания'
    ),
  title: z.string().optional(),
  description: z.string().optional(),
});

type PromoFormData = z.infer<typeof promoSchema>;

export default function AddPromoCodeDialog() {
  const form = useForm<PromoFormData>({
    resolver: zodResolver(promoSchema),
    defaultValues: {
      code: '',
      discount: 10,
      expiresAt: '',
      title: '',
      description: '',
    },
  });

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const onSubmit = async (data: PromoFormData) => {
    try {
      await createPromoCode({
        ...data,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      });
      form.reset();
      closeButtonRef.current?.click();
    } catch (err) {
      console.error('Ошибка при создании промокода:', err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='cursor-pointer'>Добавить промокод</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новый промокод</DialogTitle>
          <DialogDescription>
            Укажите параметры промокода, включая размер скидки и срок действия.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Код</FormLabel>
                  <FormControl>
                    <Input placeholder="SUMMER2025" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Скидка (%)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дата окончания (опционально)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Заголовок</FormLabel>
                  <FormControl>
                    <Input placeholder="Летняя распродажа" {...field} />
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
                    <Textarea placeholder="Описание условий промокода" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-2">
              <DialogTrigger asChild>
                <Button type="button" variant="outline" ref={closeButtonRef}>
                  Отменить
                </Button>
              </DialogTrigger>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Добавление...' : 'Добавить промокод'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
