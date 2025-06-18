"use client";
import { toast } from "sonner";
import { CardTitle } from "../ui/card";

type Props = {
  orderId: string;
};

export function OrderNumberCopy({ orderId }: Props) {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("ID скопирован в буфер обмена");
    });
  };

  return (
    <CardTitle
      className="flex flex-col  cursor-pointer"
      onClick={() => handleCopy(orderId)}
      title={`Заказ #${orderId}`}
    >
      Заказ #
      <span className="text-lg max-sm:text-base max-w-[150px] max-sm:overflow-hidden max-sm:whitespace-nowrap max-sm:text-ellipsis">
         {orderId}
      </span>
     
    </CardTitle>
  );
}
