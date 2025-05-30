import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, createProduct, deleteProduct } from '@/actions/products.action';

export async function GET() {
  const products = await getAllProducts();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newProduct = await createProduct(body);
  return NextResponse.json(newProduct);
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await deleteProduct(id);
    return NextResponse.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product:', err);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
