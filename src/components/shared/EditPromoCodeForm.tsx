'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { updatePromoCode } from '@/actions/promocode.actions';
import { PromoCode } from '@prisma/client';
import { useRouter } from 'next/navigation';

const promoSchema = z.object({
  code: z.string().min(1),
  discount: z.coerce.number().min(1).max(100),
  isActive: z.boolean(),
  expiresAt: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});

type PromoFormData = z.infer<typeof promoSchema>;

export default function EditPromoCodeDialog({ promo }: { promo: PromoCode }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<PromoFormData>({
    resolver: zodResolver(promoSchema),
    defaultValues: {
      code: promo.code,
      discount: promo.discount,
      isActive: promo.isActive,
      expiresAt: promo.expiresAt ? promo.expiresAt.toISOString().split('T')[0] : '',
      title: promo.title || '',
      description: promo.description || '',
    },
  });

  const onSubmit = (data: PromoFormData) => {
    startTransition(async () => {
      await updatePromoCode(promo.id, {
        ...data,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      });

      setOpen(false);
      router.refresh(); // 👈 обновить страницу без перезагрузки
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Редактировать</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать промокод</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField name="code" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Код</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="discount" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Скидка (%)</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="expiresAt" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Срок действия</FormLabel>
                <FormControl><Input type="date" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="title" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Заголовок</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="description" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Описание</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="isActive" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Активен</FormLabel>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )} />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
