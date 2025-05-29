import { PrismaClient } from "@/generated/prisma";
import { Product } from "../../typings";

const prisma = new PrismaClient()

export const createProduct = async (productData:Product) => {
  try{

   let existingProduct = await prisma.product.findUnique({
    where:{
      id:productData.id
    }
   })
   
    if(existingProduct){
      throw new Error("Product with this ID already exists");
    }
  
      const product = await prisma.product.create({
        data: {
          id: productData.id,
          name: productData.name,
          description: productData.description || '',
          price: productData.price,
          imageUrl: productData.imageUrl||'', 
        },
      });
  
      return product;

  }catch(err){
    console.error("Error creating product:", err);
    throw new Error("Failed to create product");
  }
};

export const getProductById = async (id: string) => {
  return await prisma.product.findUnique({ where: { id } });
};

export const getAllProducts = async () => {
  return await prisma.product.findMany();
};

export const updateProduct = async (id: string, data: {
  name?: string;
  description?: string;
  price?: number;
}) => {
  return await prisma.product.update({
    where: { id },
    data,
  });
};

export const deleteProduct = async (id: string) => {
  return await prisma.product.delete({ where: { id } });
};
