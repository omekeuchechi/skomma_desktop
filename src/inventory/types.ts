export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  slot: string;
  productId?: string;
}

export interface InventorySlot {
  index: number;
  item?: InventoryItem;
}
