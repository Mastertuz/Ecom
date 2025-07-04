import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { auth } from "../../../../auth"
import ProfileForm from "@/components/shared/ProfileForm"

async function ProfilePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  })

  const orderStats = await prisma.order.aggregate({
    where: { userId: session.user.id },
    _count: { id: true },
    _sum: { total: true },
  })

  const recentOrders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      total: true,
      status: true,
      createdAt: true,
    },
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Оплачен</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Ожидает оплаты</Badge>
      case "canceled":
        return <Badge className="bg-red-500">Отменен</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-white">Профиль</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfileForm user={user} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Статистика</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Всего заказов:</span>
                <span className="font-semibold text-lg">{orderStats._count.id || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Сумма покупок:</span>
                <span className="font-semibold text-lg">{orderStats._sum.total?.toLocaleString() || 0}₽</span>
              </div>
            </CardContent>
          </Card>

          {recentOrders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Последние заказы</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center p-3  bg-gray-800 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">#{order.id.slice(-4)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{order.total}₽</p>
                      <div className="mt-1">{getStatusBadge(order.status)}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
