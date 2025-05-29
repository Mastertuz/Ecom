import { NextApiRequest, NextApiResponse } from 'next';
import { getAllProducts,createProduct } from '@/actions/products.action';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const products = await getAllProducts();
    res.status(200).json(products);

    
  } else if (req.method === 'POST') {
    const product = req.body;
    const newProduct = await createProduct(product);
    res.status(200).json(newProduct);
  } 
//   else {
//     res.setHeader('Allow', ['GET', 'POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
}
