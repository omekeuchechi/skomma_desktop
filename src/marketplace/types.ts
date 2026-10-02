export interface ProductListing {
  id: string;
  shopId: string;
  title: string;
  description: string;
  price: number;
  currency: 'USD';
  stock: number;
  imageUrl?: string;
}

export interface ShopProfile {
  id: string;
  ownerId: string;
  name: string;
  worldPosition: { x: number; z: number };
  listings: ProductListing[];
}
