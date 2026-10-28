export type ProductItem = {
  id: number;
  title: string;
  description?: string;
  price?: number | string;
  category?: string;
  type?: string;
  status?: string;
  location?: string;
};