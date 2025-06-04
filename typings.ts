export interface Product {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  status: 'Активно' | 'Неактивно';
  stock: number
}

export type ProductCreateInput = {
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl: string;
  status?: 'Активно' | 'Неактивно';
};


export interface CartItem {
  id: string
  quantity: number
  userId: string
  productId: string
  createdAt: Date
  updatedAt: Date
  product: Product
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}
