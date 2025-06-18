"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Category } from "@prisma/client"

const categories = ["Все", ...Object.values(Category)]

export default function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category") || "Все"

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (category === "Все") {
      params.delete("category")
    } else {
      params.set("category", category)
    }

    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="w-full max-w-full sm:max-w-52 lg:max-w-xs">
      <Select value={currentCategory} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Выберите категорию" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
