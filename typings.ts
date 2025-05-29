export interface Product{
    id: string;
    name: string;
    description?: string | null;
    imageUrl?: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
}

export type ProductCreateInput = {
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
};