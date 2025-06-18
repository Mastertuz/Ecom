"use client"
import { toast } from "sonner"

function SaleBanner() {
  const sale = {
    title: "Черная Пятница",
    isActive: true,
    description: "Успейте получить скидку на все товары в корзине",
    discountAmount: 30,
    couponCode: "FRIDAY",
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(sale.couponCode)
      toast.success("Промокод скопирован!", {
        description: `"${sale.couponCode}" добавлен в буфер обмена`,
      })
    } catch (err) {
      toast.error("Не удалось скопировать промокод",err||'')
    }
  }

  if (!sale?.isActive) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-red-600 to-black text-white px-6 py-10  mt-2 max-sm:px-4 max-sm:py-6 rounded-lg shadow-lg ">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-5xl font-extrabold text-left mb-4 max-lg:text-3xl max-sm:text-2xl">{sale.title}</h2>
          <p className="text-left text-3xl  font-semibold mb-6 max-lg:text-xl max-sm:text-lg">{sale.description}</p>
          <div className="flex">
            <div className="bg-white text-black py-4 px-6 max-sm:py-2 max-sm:px-4 rounded-full shadow-md transform hover:scale-105 transition duration-300">
              <span className="font-bold text-xl max-lg:text-lg max-sm:text-base">
                Промокод:{" "}
                <span
                  className="text-red-600 cursor-pointer hover:underline"
                  onClick={handleCopyCode}
                  title="Нажмите, чтобы скопировать"
                >
                  {sale.couponCode}
                </span>
              </span>
              <span className="ml-2 font-bold text-xl max-lg:text-lg max-sm:text-base">на скидку {sale.discountAmount}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SaleBanner
