"use client";
import { useState } from "react";
import { toast } from "sonner";
import { CardTitle } from "../ui/card";

type Props = {
  orderId: string;
};

export function OrderNumberCopy({ orderId }: Props) {
   const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
      toast.success('ID скопирован в буфер обмена');
      }
    );
  }

  return (
    <CardTitle className="text-lg max-sm:text-base pr-4 " onClick={()=>handleCopy(orderId)}>Заказ #{orderId}</CardTitle>
  );
}