import type { ProductItem } from "./product";

export type CartItem = {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  createdAt: string; // ISO date string from API
  updatedAt: string; // ISO date string from API
  product: ProductItem;
};

export type Cart = {
    id:string;
  items: CartItem[];
};

export type DeliveryOptionsProps = {
  id:string;
  name:string;
  time:string;
  price:string;
  badge:string;
  icon:string;
  description:string;
};
