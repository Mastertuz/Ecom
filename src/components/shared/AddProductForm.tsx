// src/app/components/shared/AddProductForm.tsx
"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

import { UploadDropzone } from "@uploadthing/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createProduct } from "@/actions/products.action";
import { PlusCircle } from "lucide-react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

const productSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Цена должна быть положительной"),
  stock: z.coerce.number().min(1, "Количество товара не может быть меньше 1"),
  status: z.enum(["Активно", "Неактивно"]),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProductDialog() {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 1,
      status: "Активно",
    },
  });

  const [imageUrl, setImageUrl] = useState("");

  const onSubmit = async (data: ProductFormData) => {
    if (!imageUrl) {
      alert("Пожалуйста, загрузите изображение.");
      return;
    }

    try {
      await createProduct({ ...data, imageUrl });
      form.reset();
      setImageUrl("");
    } catch (err) {
      console.error("Ошибка при создании:", err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer" variant="outline">
          <span>Добавить товар</span>
          <PlusCircle className="h-4 w-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Добавление товара</DialogTitle>
          <DialogDescription>
            Заполните информацию о товаре. Загрузите изображение и нажмите "Добавить".
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Input type="number" placeholder="Введите цену" {...field} />
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
                    <Input type="number" placeholder="Введите количество" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Изображение товара</FormLabel>
              {imageUrl ? (
                <img src={imageUrl} alt="Uploaded" className="h-40 rounded-md mt-2" />
              ) : (
                <UploadDropzone<OurFileRouter, "postImage">
                  endpoint="postImage"
                  onClientUploadComplete={(res) => {
                    if (res && res[0]?.ufsUrl) {
                      setImageUrl(res[0].ufsUrl);
                    }
                  }}
                  onUploadError={(error: Error) => {
                    alert(`Ошибка загрузки: ${error.message}`);
                  }}
                />
              )}
            </div>

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Добавление..." : "Добавить товар"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
