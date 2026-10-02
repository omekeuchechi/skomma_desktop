export type OrderStatus = 'placed' | 'processing' | 'shipped' | 'in transit' | 'delivered' | 'cancelled';

export interface OrderLine {
  productId: string;
  title: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  lines: OrderLine[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}
