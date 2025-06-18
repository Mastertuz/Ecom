"use client"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { UploadDropzone } from "@uploadthing/react"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createProduct } from "@/actions/products.action"
import { PlusCircle } from "lucide-react"
import type { OurFileRouter } from "@/app/api/uploadthing/core"
import { Category } from "@prisma/client"

const categories = Object.values(Category)

const productSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Цена должна быть положительной"),
  stock: z.coerce.number().min(1, "Количество товара не может быть меньше 1"),
  category: z.nativeEnum(Category),
  status: z.enum(["Активно", "Неактивно"]),
})

type ProductFormData = z.infer<typeof productSchema>

export default function AddProductDialog() {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 1,
      category: Category.Кроссовки,
      status: "Активно",
    },
  })

  const [imageUrl, setImageUrl] = useState("")
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const onSubmit = async (data: ProductFormData) => {
    if (!imageUrl) {
      alert("Пожалуйста, загрузите изображение.")
      return
    }

    try {
      await createProduct({ ...data, imageUrl })
      form.reset()
      setImageUrl("")
      closeButtonRef.current?.click()
    } catch (err) {
      console.error("Ошибка при создании:", err)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full max-w-44 max-md:max-w-16 cursor-pointer ">
          <span className="hidden md:inline">Добавить товар</span>
          <PlusCircle className="h-4 w-4 ml-2 max-md:ml-0" />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-[600px] max-h-[95vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-2 sm:space-y-3">
          <DialogTitle className="text-lg sm:text-xl">Добавление товара</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Заполните информацию о товаре и загрузите изображение.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Название</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Введите название товара"
                      className="h-10 sm:h-11 text-sm sm:text-base"
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
                        placeholder="Введите цену"
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
                        placeholder="Введите количество"
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
                      alt="Uploaded"
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
                    * Изображение обязательно для добавления товара
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto order-2 sm:order-1 h-10 sm:h-11 text-sm sm:text-base"
                >
                  Отменить
                </Button>
              </DialogTrigger>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || !imageUrl}
                className="w-full sm:w-auto order-1 sm:order-2 h-10 sm:h-11 text-sm sm:text-base"
              >
                {form.formState.isSubmitting ? "Добавление..." : "Добавить товар"}
              </Button>
              <DialogTrigger asChild>
                <button type="button" ref={closeButtonRef} className="hidden" />
              </DialogTrigger>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
