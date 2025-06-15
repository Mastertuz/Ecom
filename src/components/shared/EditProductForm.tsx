"use client"

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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Product } from "../../../typings"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRef } from "react"
import { UploadDropzone } from "@uploadthing/react"
import { useState } from "react"
import type { OurFileRouter } from "@/app/api/uploadthing/core"
import { updateProduct } from "@/actions/products.action"
import { Category } from "@prisma/client"

const categories = Object.values(Category)

const productSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Цена должна быть положительной"),
  imageUrl: z.string().optional(),
  stock: z.coerce.number().min(1, "Количество не может быть меньше 1"),
  category: z.nativeEnum(Category),
  status: z.enum(["Активно", "Неактивно"]),
})

type ProductFormData = z.infer<typeof productSchema>

interface EditProductDialogProps {
  product: Product
}

export function EditProductDialog({ product }: EditProductDialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      description: product.description || "",
      price: product.price,
      imageUrl: product.imageUrl || "",
      stock: product.stock,
      category: product.category,
      status: product.status,
    },
  })

  const [imageUrl, setImageUrl] = useState(product.imageUrl || "")

  const onSubmit = async (data: ProductFormData) => {
    if (!imageUrl) {
      alert("Пожалуйста, загрузите изображение товара.")
      return
    }

    try {
      await updateProduct(product.id, { ...data, imageUrl })
      closeRef.current?.click()
    } catch (err) {
      console.error("Ошибка при обновлении товара:", err)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost">Редактировать</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Редактировать товар</AlertDialogTitle>
          <AlertDialogDescription>Измените необходимые поля и нажмите "Сохранить".</AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input placeholder="Название товара" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Категория</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Цена (₽)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Цена товара" {...field} />
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
                      <Input type="number" placeholder="Количество товара" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel>Изображение товара</FormLabel>
              {imageUrl ? (
                <div className="mt-2">
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt="Product"
                    className="h-40 w-full object-cover rounded-md"
                  />
                  <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => setImageUrl("")}>
                    Изменить изображение
                  </Button>
                </div>
              ) : (
                <div>
                  <UploadDropzone<OurFileRouter, "postImage">
                    endpoint="postImage"
                    onClientUploadComplete={(res) => {
                      if (res && res[0]?.url) {
                        setImageUrl(res[0].url)
                      }
                    }}
                    onUploadError={(error: Error) => {
                      alert(`Ошибка загрузки: ${error.message}`)
                    }}
                  />
                  {!imageUrl && (
                    <p className="text-sm text-red-500 mt-2">* Изображение обязательно для сохранения изменений</p>
                  )}
                </div>
              )}
            </div>

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

            <AlertDialogFooter>
              <AlertDialogCancel ref={closeRef}>Отменить</AlertDialogCancel>
              <AlertDialogAction type="submit" disabled={form.formState.isSubmitting || !imageUrl}>
                {form.formState.isSubmitting ? "Сохранение..." : "Сохранить"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
