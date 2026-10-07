export type ProductItem = {
  id: number | string;
  title: string;
  description?: string;
  price?: number | string;
  category?: string;
  type?: string;
  status?: string;
  location?: string;
};