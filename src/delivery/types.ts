export interface DeliveryAddress {
  id: string;
  userId: string;
  label: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export type DeliveryStatus = 'assigned' | 'picked up' | 'out for delivery' | 'completed' | 'failed';

export interface Delivery {
  id: string;
  orderId: string;
  address: DeliveryAddress;
  status: DeliveryStatus;
  estimatedArrival: string;
  trackingNumber?: string;
}
