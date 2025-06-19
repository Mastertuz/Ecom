"use client"

import { toast } from "sonner"

export default function CopyButton({ code }: { code: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      toast.success("Промокод скопирован!", {
        description: `"${code}" добавлен в буфер обмена`,
      })
    } catch {
      toast.error("Не удалось скопировать промокод")
    }
  }

  return (
    <span
      className="text-red-600 cursor-pointer hover:underline"
      onClick={handleCopy}
      title="Нажмите, чтобы скопировать"
    >
      {code}
    </span>
  )
}
