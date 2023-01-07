export type PricingRule = {
  customerId: string
  products: string[]
  ruleType: string
  ruleConfig: {
    eligibleQuantity?: number
    discountedQuantity?: number
    discountedPrice?: number
  }
}

export type CheckOutItem = {
  productId: string
  productName?: string
  price: number
  qty?: number
}

export type CheckOutItemDraft = {
  productId: string
}
