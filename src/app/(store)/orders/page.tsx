import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { auth } from "../../../../auth"
import { toast } from "sonner"
import { OrderNumberCopy } from "@/components/shared/CopyToClipboard"

async function OrdersPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/sign-in")
  }
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
      toast.success('ID скопирован в буфер обмена');
      }
    );
  }

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
    <div className="container mx-auto  p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-white">Мои заказы</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">У вас пока нет заказов</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start max-sm:flex-col">
                  <div className="flex flex-wrap flex-col">
                    <OrderNumberCopy orderId={order.id} />
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                    </p>
                  </div>
                  <div className="max-sm mt-2">
                  {getStatusBadge(order.status)
                  }
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.product.name} x{item.quantity}
                      </span>
                      <span>{item.price * item.quantity}₽</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 font-semibold flex justify-between">
                    <span>Итого:</span>
                    <span>{order.total}₽</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrdersPage
