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
        <Button variant="ghost" size="sm" className="h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3">
          <span className="hidden sm:inline">Редактировать</span>
          <span className="sm:hidden">Ред.</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[95vw] max-w-[700px] max-h-[95vh] overflow-y-auto p-4 sm:p-6">
        <AlertDialogHeader className="space-y-2 sm:space-y-3">
          <AlertDialogTitle className="text-lg sm:text-xl">Редактировать товар</AlertDialogTitle>
          <AlertDialogDescription className="text-sm sm:text-base">
            Измените необходимые поля и нажмите "Сохранить".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Название</FormLabel>
                  <FormControl>
                    <Input placeholder="Название товара" className="h-10 sm:h-11 text-sm sm:text-base" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Категория</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base">
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category} className="text-sm sm:text-base">
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Статус</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base">
                          <SelectValue placeholder="Выберите статус" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Активно" className="text-sm sm:text-base">
                          Активно
                        </SelectItem>
                        <SelectItem value="Неактивно" className="text-sm sm:text-base">
                          Неактивно
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Описание</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Описание товара"
                      className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Цена (₽)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Цена товара"
                        className="h-10 sm:h-11 text-sm sm:text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Количество</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Количество товара"
                        className="h-10 sm:h-11 text-sm sm:text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel className="text-sm sm:text-base">Изображение товара</FormLabel>
              {imageUrl ? (
                <div className="mt-3">
                  <div className="relative w-full">
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt="Product"
                      className="h-32 sm:h-40 w-full object-cover rounded-md border"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
                    onClick={() => setImageUrl("")}
                  >
                    Изменить изображение
                  </Button>
                </div>
              ) : (
                <div className="mt-3">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 sm:p-4">
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
                      className="ut-button:h-8 sm:ut-button:h-10 ut-button:text-xs sm:ut-button:text-sm ut-allowed-content:text-xs sm:ut-allowed-content:text-sm"
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-red-500 mt-2">
                    * Изображение обязательно для сохранения изменений
                  </p>
                </div>
              )}
            </div>

            <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
              <AlertDialogCancel
                ref={closeRef}
                className="w-full sm:w-auto order-2 sm:order-1 h-10 sm:h-11 text-sm sm:text-base"
              >
                Отменить
              </AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                disabled={form.formState.isSubmitting || !imageUrl}
                className="w-full sm:w-auto order-1 sm:order-2 h-10 sm:h-11 text-sm sm:text-base"
              >
                {form.formState.isSubmitting ? "Сохранение..." : "Сохранить"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
