import { CheckOutItem, CheckOutItemDraft, PricingRule } from '../types/custom-types'
import productData from '../data/products.json'
import { PRICERULESTYPES } from '../config/constantans'
export class Checkout {
  private rules: PricingRule[]
  private items: CheckOutItem[]
  private checkOutTotal: number

  constructor(pricingrules: PricingRule[]) {
    this.rules = pricingrules
    this.items = []
    this.checkOutTotal = 0
  }
  add(itemDraft: CheckOutItemDraft) {
    //fetch product data by id
    const product = productData.products.find((product) => product.id === itemDraft.productId)
    //if price not found for a product do not add item and log an error
    if (!product?.price) {
      console.error(`product ${itemDraft.productId} not added. Missing price`)
      return
    }

    this.items.push({ productId: itemDraft.productId, price: product?.price, productName: product.name })
    this.calculateTotal()
  }
  total(): number {
    return this.checkOutTotal
  }

  /**
   * Calculates checkout total and updates the private variable checkOutTotal
   */
  private calculateTotal() {
    if (this.items.length === 0) return

    const distinctItemsAndRulesMap: { item: CheckOutItem; rules: PricingRule[] }[] = []
    this.items.forEach((item) => {
      const itemExists = distinctItemsAndRulesMap.find((aryItem) => aryItem.item.productId === item.productId)
      if (itemExists) {
        distinctItemsAndRulesMap.splice(distinctItemsAndRulesMap.indexOf(itemExists))
        distinctItemsAndRulesMap.push({
          item: { ...itemExists.item, qty: (itemExists.item?.qty || 0) + 1 },
          rules: itemExists.rules,
        })
      } else {
        distinctItemsAndRulesMap.push({
          item: { ...item, qty: 1 },
          rules: this.rules.filter((rule) => {
            return rule.products.includes(item.productId)
          }),
        })
      }
    })
    let checkOutTotal = 0

    distinctItemsAndRulesMap.forEach((distinctItemAndRules) => {
      //identify rules by type
      const disCountedPriceRule = distinctItemAndRules.rules.find(
        (rule) => rule.ruleType === PRICERULESTYPES.DISCOUNTED_PRICE
      )

      const itemPrice = disCountedPriceRule?.ruleConfig.discountedPrice || distinctItemAndRules.item.price
      const bulkBuyDiscountRule = distinctItemAndRules.rules.find((rule) => rule.ruleType === PRICERULESTYPES.BULK_BUY)

      let itemQuantity = distinctItemAndRules.item.qty
      //check quantity eligibility and apply discount
      if (bulkBuyDiscountRule?.ruleConfig.eligibleQuantity === distinctItemAndRules.item.qty)
        itemQuantity = bulkBuyDiscountRule?.ruleConfig.discountedQuantity

      if (itemPrice && itemQuantity) checkOutTotal += itemPrice * itemQuantity
    })
    this.checkOutTotal = checkOutTotal
  }
}
