"use client";

import { PromoCode } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddPromoCodeDialog from "@/components/shared/AddPromoCodeForm";
import EditPromoCodeDialog from "./EditPromoCodeForm";
import DeletePromoCodeButton from "./DeletePromoCode";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Button } from "../ui/button";
import Link from "next/link";

export default function PromoCodesPanel({
  promocodes,
}: {
  promocodes: PromoCode[];
}) {
  const activeCodes = promocodes.filter((p) => p.isActive);
  const inactiveCodes = promocodes.filter((p) => !p.isActive);

  return (
    <main className="p-12 max-sm:p-2 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Промокоды</h1>
        <div className="space-x-2">
        <AddPromoCodeDialog />
        <Button asChild>
          <Link href={'/admin'}>
          Товары
          </Link>
        </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="bg-muted rounded-md">
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="active">Активные</TabsTrigger>
          <TabsTrigger value="inactive">Неактивные</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <PromoTable data={promocodes} />
        </TabsContent>
        <TabsContent value="active">
          <PromoTable data={activeCodes} />
        </TabsContent>
        <TabsContent value="inactive">
          <PromoTable data={inactiveCodes} />
        </TabsContent>
      </Tabs>
    </main>
  );
}

function PromoTable({ data }: { data: PromoCode[] }) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('ID скопирован в буфер обмена');
    });
  };

  if (!data.length) {
    return (
      <div className="text-muted-foreground py-8 text-center text-sm">
        Нет промокодов
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Код</TableHead>
          <TableHead>Скидка</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead>Истекает</TableHead>
          <TableHead>Название</TableHead>
          <TableHead>Описание</TableHead>
          <TableHead>ID</TableHead>
          <TableHead>Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((promo) => (
          <TableRow key={promo.id}>
            <TableCell className="font-mono">{promo.code}</TableCell>
            <TableCell>{promo.discount}%</TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                  promo.isActive
                    ? "bg-green-500 text-black ring-green-600/20"
                    : "bg-red-500 text-black ring-gray-600/20"
                }`}
              >
                {promo.isActive ? "Активен" : "Неактивен"}
              </span>
            </TableCell>
            <TableCell>
              {promo.expiresAt
                ? new Date(promo.expiresAt).toLocaleDateString("ru-RU")
                : "—"}
            </TableCell>
            <TableCell>{promo.title || "—"}</TableCell>
            <TableCell>
              <span>{promo.description || "—"}</span>
            </TableCell>
            <TableCell
              onClick={() => copyToClipboard(promo.id)}
              className="cursor-pointer hover:text-blue-600"
            >
              {promo.id}
            </TableCell>
            <TableCell className="space-x-2">
              <EditPromoCodeDialog promo={promo} />
              <DeletePromoCodeButton promoId={promo.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
