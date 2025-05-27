// src/app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt: string;
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', imageUrl: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

 const fetchProducts = async () => {
  try {
    const res = await fetch('/api/products');
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error fetching products:', res.status, errorText);
      return;
    }
    const data = await res.json();
    setProducts(data);
  } catch (err) {
    console.error('fetchProducts Error:', err);
  }
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/products/${editingId}` : '/api/products';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        imageUrl: form.imageUrl,
      }),
    });
    setForm({ name: '', description: '', price: '', imageUrl: '' });
    setEditingId(null);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      imageUrl: product.imageUrl,
    });
    setEditingId(product.id);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <p className="mb-4 text-white">Manage your products and view their sales performance.</p>

      <form onSubmit={handleSubmit} className="mb-8 grid gap-4 max-w-xl">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          className="border p-2 rounded"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? 'Update Product' : 'Add Product'}
        </button>
      </form>

      <table className="min-w-full table-auto text-left border">
        <thead className="">
          <tr>
            <th className="px-4 py-2">Название</th>
            <th className="px-4 py-2">Статус</th>
            <th className="px-4 py-2">Цена</th>
            <th className="px-4 py-2">Создано</th>
            <th className="px-4 py-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t">
              <td className="px-4 py-2 flex items-center gap-4">
                <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded" />
                <div>{product.name}</div>
              </td>
              <td className="px-4 py-2">
                <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded">Active</span>
              </td>
              <td className="px-4 py-2 font-semibold">${product.price.toFixed(2)}</td>
              <td className="px-4 py-2 text-sm text-gray-500">
                {new Date(product.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 space-x-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
