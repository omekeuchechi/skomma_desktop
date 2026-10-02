export type PaymentMethod = 'card' | 'wallet' | 'crypto';

export type PaymentStatus = 'pending' | 'authorized' | 'captured' | 'refunded' | 'failed';

export interface Payment {
  id: string;
  orderId: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
}
