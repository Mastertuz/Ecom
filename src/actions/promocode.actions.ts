'use server';

import { prisma } from '@/lib/prisma'; 

interface PromoCodeInput {
  code: string;
  discount: number;
  expiresAt?: Date | null;
  title?: string;
  description?: string;
}

export async function createPromoCode(data: PromoCodeInput) {
  return await prisma.promoCode.create({
    data: {
      ...data,
      isActive: true,
    },
  });
}
export async function updatePromoCode(id: string, data: Partial<{
  code: string;
  discount: number;
  isActive: boolean;
  expiresAt: Date | null;
  title?: string;
  description?: string;
}>) {
  return await prisma.promoCode.update({
    where: { id },
    data,
  });
}


export async function deletePromoCode(id: string) {
  return await prisma.promoCode.delete({
    where: { id },
  });
}