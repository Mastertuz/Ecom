import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { auth } from '../../../../../auth';
import PromoCodesPanel from '@/components/shared/PromocodesPanel';

export default async function PromoCodesPage() {
  const session = await auth();
  if (session?.user?.role !== 'admin') return notFound();

  const promocodes = await prisma.promoCode.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <PromoCodesPanel promocodes={promocodes} />;
}
