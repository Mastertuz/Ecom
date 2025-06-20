"use server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { Category, Status } from "@prisma/client"

interface ProductCreateInput {
  name: string
  description?: string
  price: number
  stock: number
  imageUrl: string
  category?: Category
  status?: Status
}

export const createProduct = async (productData: ProductCreateInput) => {
  try {
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description || "",
        price: productData.price,
        imageUrl: productData.imageUrl || "",
        status: productData.status || "ACTIVE",
        category: productData.category,
        stock: productData.stock,
      },
    })

    revalidatePath("/")
    return product
  } catch (err) {
    console.error("Error creating product:", err)
    throw new Error("Failed to create product")
  }
}

export const getProductById = async (id: string) => {
  try {
    return await prisma.product.findUnique({ where: { id } })
  } catch (error) {
    console.error("Error fetching product by id:", error)
    return null
  }
}

export const getProductsByName = async (query: string) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
    })
    return products
  } catch (error) {
    console.error("Error searching products:", error)
    return []
  }
}

export const getAllProducts = async (category?: string) => {
  try {
    const whereClause = category && category !== "Все" ? { category: category as Category } : {}

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageUrl: true,
        category: true,
        createdAt: true,
        updatedAt: true,
        stock: true,
        status: true,
      },
    })

    return products
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export const getProductCategories = async () => {
  try {
    const categories = await prisma.product.findMany({
      select: {
        category: true,
      },
      distinct: ["category"],
    })

    return categories.map((item) => item.category)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export const updateProduct = async (id: string, data: ProductCreateInput) => {
  try {
    const updated = await prisma.product.update({
      where: { id },
      data,
    })

    revalidatePath("/")
    return updated
  } catch (err) {
    console.error("Error updating product:", err)
    throw new Error("Failed to update product")
  }
}

export const deleteProduct = async (id: string) => {
  try {
    return await prisma.product.delete({ where: { id } })
  } catch (error) {
    console.error("Error deleting product:", error)
    throw new Error("Failed to delete product")
  }
}
