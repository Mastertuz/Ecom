"use client";

import { PromoCode } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddPromoCodeDialog from "@/components/shared/AddPromoCodeForm";
import { Badge } from "@/components/ui/badge";
import EditPromoCodeDialog from "./EditPromoCodeForm";
import DeletePromoCodeButton from "./DeletePromoCode";

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
        <AddPromoCodeDialog />
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
  if (!data.length) {
    return (
      <div className="text-muted-foreground py-8 text-center text-sm">
        Нет промокодов
      </div>
    );
  }

  return (
    <div className="overflow-auto border rounded-lg">
      <table className="min-w-full table-auto text-sm">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="p-3 text-left">Код</th>
            <th className="p-3 text-left">Скидка</th>
            <th className="p-3 text-left">Активность</th>
            <th className="p-3 text-left">Истекает</th>
            <th className="p-3 text-left">Название</th>
            <th className="p-3 text-left">Описание</th>
            <th className="p-3 text-left">Действия</th>
          </tr>
        </thead>
        <tbody>
          {data.map((promo) => (
            <tr key={promo.id} className="border-t">
              <td className="p-3 font-mono">{promo.code}</td>
              <td className="p-3">{promo.discount}%</td>
              <td className="p-3">
                <Badge variant={promo.isActive ? "default" : "destructive"}>
                  {promo.isActive ? "Активен" : "Неактивен"}
                </Badge>
              </td>
              <td className="p-3">
                {promo.expiresAt
                  ? new Date(promo.expiresAt).toLocaleDateString("ru-RU")
                  : "—"}
              </td>
              <td className="p-3">{promo.title || "—"}</td>
              <td className="p-3">
                <span>{promo.description || "—"}</span>
              </td>
              <td className="p-3 flex flex-wrap gap-2 items-center">
                <EditPromoCodeDialog promo={promo} />
                <DeletePromoCodeButton promoId={promo.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
