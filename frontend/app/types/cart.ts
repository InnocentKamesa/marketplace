import { LucideIcon } from "lucide-react";
import type { ProductItem } from "./product";
import type {CampusFormProps} from "../checkout/page"

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
  price:number;
  badge:string;
  icon:LucideIcon;
  description:string;
};

export type AddressProps = {
  campusForm: CampusFormProps;
  setCampusForm: React.Dispatch<React.SetStateAction<number>>;
};


export type DeliveryMethodsCardProps = {
  options:DeliveryOptionsProps[];
  selectedDeliveryId:string;
  setSelectedDeliveryId: React.Dispatch<React.SetStateAction<string>>;
}

export type PaymentMethodsCardProps = {
  paymentMethod:string;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
  mobileNumber:string;
  setMobileNumber: React.Dispatch<React.SetStateAction<string>>;
  mobileProvider:string;
  setMobileProvider: React.Dispatch<React.SetStateAction<string>>;
}