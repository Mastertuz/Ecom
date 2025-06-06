'use server';
import { prisma } from '@/lib/prisma';
import { ProductCreateInput } from '../../typings';
import { revalidatePath } from 'next/cache';

export const createProduct = async (productData: ProductCreateInput) => {
  try {
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description || '',
        price: productData.price,
        imageUrl: productData.imageUrl || '',
        status: productData.status || 'Активно',
      },
    });

    revalidatePath('/');
    return product;
  } catch (err) {
    console.error('Error creating product:', err);
    throw new Error('Failed to create product');
  }
};

export const getProductById = async (id: string) => {
  return await prisma.product.findUnique({ where: { id } });
};

export const getProductsByName = async(query:string)=>{
  
  const products =  await prisma.product.findMany({
    where:{
      name:{
        contains:query,
        mode:'insensitive'
      }
    }
  })
  return products
}

export const getAllProducts = async () => {
  return await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
      stock:true,
      status: true,
    },
  });
};

export const updateProduct = async (id: string, data: ProductCreateInput) => {
  try {
    const updated = await prisma.product.update({
      where: { id },
      data,
    });

    revalidatePath('/');
    return updated;
  } catch (err) {
    console.error('Error updating product:', err);
    throw new Error('Failed to update product');
  }
};

export const deleteProduct = async (id: string) => {
  return await prisma.product.delete({ where: { id } });
};