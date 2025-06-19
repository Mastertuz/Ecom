
import { PromoCode } from "../../../typings"
import CopyButton from "./CopyButton"

interface SaleBannerData {
  title: string
  description: string
  promoCode: PromoCode | null
}

async function getPromoData(): Promise<SaleBannerData | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/promo/active`)

    if (!res.ok) return null

    return res.json()
  } catch (error) {
    console.error("Ошибка получения промо-данных:", error)
    return null
  }
}

export default async function SaleBanner() {
  const bannerData = await getPromoData()

  if (!bannerData?.promoCode || !bannerData.promoCode.isActive) {
    return null
  }

  const { promoCode } = bannerData
  const isExpired = promoCode.expiresAt && new Date(promoCode.expiresAt) < new Date()

  if (isExpired) return null

  return (
    <div className="bg-gradient-to-r from-red-600 to-black text-white px-6 py-10 mt-2 max-sm:px-4 max-sm:py-6 rounded-lg shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-5xl font-extrabold text-left mb-4 max-lg:text-3xl max-sm:text-2xl">{bannerData.title}</h2>
          <p className="text-left text-3xl font-semibold mb-6 max-lg:text-xl max-sm:text-lg">
            {bannerData.description}
          </p>

          <div className="flex">
            <div className="bg-white text-black py-4 px-6 max-sm:py-2 max-sm:px-4 rounded-full shadow-md transform hover:scale-105 transition duration-300">
              <span className="font-bold text-xl max-lg:text-lg max-sm:text-base">
                Промокод:{" "}
                <CopyButton code={promoCode.code} />
              </span>
              <span className="ml-2 font-bold text-xl max-lg:text-lg max-sm:text-base">
                на скидку {promoCode.discount}%
              </span>
            </div>
          </div>

          {promoCode.expiresAt && (
            <p className="text-sm opacity-80 mt-2">
              Действует до: {new Date(promoCode.expiresAt).toLocaleDateString("ru-RU")}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
