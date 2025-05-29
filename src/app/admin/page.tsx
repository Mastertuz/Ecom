
import { createProduct, getAllProducts } from '@/actions/products.action';

export default async function AdminPage() {
   const products = await getAllProducts()
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Товары</h1>
      <p className="mb-4 text-white">Управление товарами.</p>

       

      <table className="min-w-full table-auto text-left border">
        <thead className="">
          <tr>
            <th className="px-4 py-2">Изображение</th>
            <th className="px-4 py-2">Название</th>
            <th className="px-4 py-2">Статус</th>
            <th className="px-4 py-2">Цена</th>
            <th className="px-4 py-2">Создано</th>
            <th className="px-4 py-2">Действия</th>
            <th className="px-4 py-2">id</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t">
              <td className="p-4">
                <img src={product.imageUrl} alt={product.name} className="w-32 h-24 object-cover rounded" />
              </td>
              <td className="p-4">
                <span className="">{product.name}</span>
              </td>
              <td className="p-4">
                <span className="bg-green-400 text-black text-sm px-2 py-1 rounded">Активно</span>
              </td>
              <td className="p-4 font-semibold">${product.price.toFixed(2)}</td>
              <td className="p-4  text-sm ">
                {new Date(product.createdAt).toLocaleDateString()}
              </td>
              <td className="p-4 space-x-2">
                <button
                  className="cursor-pointer text-blue-600 hover:underline"
                  
                >
                  Изменить
                </button>
                <button
                  className="cursor-pointer text-red-600 hover:underline"
                >
                  Удалить
                </button>
              </td>
              <td className="px-4 py-2 text-sm ">
                {product?.id}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
