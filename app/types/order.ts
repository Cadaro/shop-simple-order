export interface OrderHeadStorage {
  orderId: string
  userId: number
}

export interface OrderSkuStorage {
  itemId: string
  qty: number
  itemPrice: number
  currency: string
}
