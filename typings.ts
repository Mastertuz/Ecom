export interface Product {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  status: 'Активно' | 'Неактивно';
}

export type ProductCreateInput = {
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  status?: 'Активно' | 'Неактивно';
};
