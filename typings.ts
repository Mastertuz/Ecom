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
