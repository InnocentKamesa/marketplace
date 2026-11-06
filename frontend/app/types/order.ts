import type {ProductItem} from "./product"

export type OrderProps = {
    id: string;
    buyerId:number;
    orderNumber:string;
    createdAt:string;
    paymentMethod:string;
    paymentStatus:string;
    total:number;
    subtotal:number;
    deliveryFee:number;
    currency:string;
    shippingAddress:string;
    items: OrderItemProps[];

}

type OrderItemProps = {
    id: string;
    orderId: string;
    productId: string;
    title: string;
    sellerId:number;
    product: ProductItem;
    unitPrice:number;
    subTotal:number;
    quantity:number;
}