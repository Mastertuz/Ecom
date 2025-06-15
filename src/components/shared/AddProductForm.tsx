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
      category: Category.ВСЕ,
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
        <Button variant="outline">
          Добавить товар
          <PlusCircle className="h-4 w-4 ml-2" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавление товара</DialogTitle>
          <DialogDescription>Заполните информацию о товаре и загрузите изображение.</DialogDescription>
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Цена (₽)</FormLabel>
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
            </div>

            <div>
              <FormLabel>Изображение товара</FormLabel>
              {imageUrl ? (
                <div className="mt-2">
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt="Uploaded"
                    className="h-40 w-full object-cover rounded-md"
                  />
                  <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => setImageUrl("")}>
                    Изменить изображение
                  </Button>
                </div>
              ) : (
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
              )}
            </div>

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting || !imageUrl}>
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
