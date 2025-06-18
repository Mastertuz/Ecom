"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Camera, Save } from "lucide-react"
import { UploadDropzone } from "@uploadthing/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import type { OurFileRouter } from "@/app/api/uploadthing/core"
import { updateProfile } from "@/actions/profile.actions"

interface User {
  id: string
  name: string | null
  email: string
  image: string | null
}

interface ProfileFormProps {
  user: User | null
}

const profileSchema = z.object({
  firstName: z.string().min(1, "Имя обязательно"),
  lastName: z.string().min(1, "Фамилия обязательна"),
  image: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfileForm({ user }: ProfileFormProps) {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.name?.split(" ")[0] || "",
      lastName: user?.name?.split(" ")[1] || "",
      image: user?.image || "",
    },
  })

  const imageUrl = form.watch("image")

  const onSubmit = async (data: ProfileFormData) => {
    const loadingToast = toast.loading("Сохранение профиля...")

    try {
      const fullName = `${data.firstName} ${data.lastName}`.trim()
      await updateProfile({
        name: fullName,
        image: data.image,
      })

      toast.success("Профиль успешно обновлен!", {
        id: loadingToast,
      })
    } catch (error) {
      console.error("Ошибка обновления профиля:", error)
      toast.error("Не удалось обновить профиль", {
        id: loadingToast,
        description: "Попробуйте еще раз",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Редактировать профиль</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <p>{imageUrl}</p>
                <Avatar className="w-24 h-24 md:w-32 md:h-32">
                  <AvatarImage src={imageUrl || "/placeholder.svg"} alt="Фото профиля" 
                  onLoad={()=>console.log("Image loaded successfully")}
                  onError={()=> console.error("Failed to load image")}
                  />
                  <AvatarFallback className="text-lg md:text-xl"
                  
                  >
                    {form.watch("firstName")?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2">
                  <Camera className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="w-full max-w-xs">
                    {imageUrl ? (
                      <div className="space-y-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            field.onChange("")
                            toast("Фото удалено", {
                              description: "Загрузите новое изображение",
                            })
                          }}
                        >
                          Изменить фото
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-2">
                        <UploadDropzone<OurFileRouter, "postImage">
                          endpoint="postImage"
                          onClientUploadComplete={(res) => {
                            if (res && res[0]?.url) {
                              field.onChange(res[0].url)
                              toast.success("Фото успешно загружено!")
                            }
                          }}
                          onUploadError={(error: Error) => {
                            console.error("Ошибка загрузки:", error)
                            toast.error("Ошибка загрузки изображения", {
                              description: error.message,
                            })
                          }}
                          className="ut-button:h-8 ut-button:text-xs ut-allowed-content:text-xs"
                        />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите имя" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Фамилия</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите фамилию" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormLabel>Email</FormLabel>
              <Input type="email" value={user?.email || ""} disabled className="bg-gray-100 dark:bg-gray-800" />
              <p className="text-xs text-muted-foreground">Email нельзя изменить</p>
            </div>

            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full md:w-auto">
              {form.formState.isSubmitting ? (
                "Сохранение..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить изменения
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
