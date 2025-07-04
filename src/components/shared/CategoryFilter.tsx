"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Category } from "@prisma/client"

const categoryLabels: Record<string, string> = {
  Все: "Все",
  [Category.SNEAKERS]: "Кроссовки",
  [Category.POLO]: "Поло",
  [Category.HOODIES]: "Толстовки",
  [Category.SHOES]: "Кеды",
  [Category.ACCESSORIES]: "Аксессуары",
}

const categoryValues: Record<string, string> = {
  Все: "Все",
  Кроссовки: Category.SNEAKERS,
  Поло: Category.POLO,
  Толстовки: Category.HOODIES,
  Кеды: Category.SHOES,
  Аксессуары: Category.ACCESSORIES,
}

const categories = ["Все", ...Object.values(Category)]

export default function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category") || "Все"

  const getCurrentDisplayValue = () => {
    if (currentCategory === "Все") return "Все"
    return categoryLabels[currentCategory] || currentCategory
  }

  const handleCategoryChange = (displayValue: string) => {
    const params = new URLSearchParams(searchParams.toString())

    const enumValue = categoryValues[displayValue]

    if (enumValue === "Все") {
      params.delete("category")
    } else {
      params.set("category", enumValue)
    }

    router.push(`/?${params.toString()}`)
  }

  return (
      <Select value={getCurrentDisplayValue()} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-full max-w-full sm:max-w-52 lg:max-w-xs">
          <SelectValue placeholder="Выберите категорию" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => {
            const displayLabel = category === "Все" ? "Все" : categoryLabels[category]
            return (
              <SelectItem key={category} value={displayLabel}>
                {displayLabel}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
  )
}
