import { CheckOutItem, CheckOutItemDraft, PricingRule } from '../types/custom-types'
import productData from '../data/products.json'
import { PRICERULESTYPES } from '../config/constants'
export class CheckoutService {
  private rules: PricingRule[]
  private items: CheckOutItem[]
  private checkOutTotal: number

  constructor(pricingrules: PricingRule[]) {
    this.rules = pricingrules
    this.items = []
    this.checkOutTotal = 0
  }

  /**
   *
   * @param itemDraft
   * @returns
   *
   * Adds a product to checkout object
   */
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
    //there is nothign to calculate there are no items in the checkout object
    if (this.items.length === 0) return

    const distinctItemsAndRulesArray: { item: CheckOutItem; rules: PricingRule[] }[] =
      this.determineDistinctItemsAndRules()

    let checkOutTotal = 0

    distinctItemsAndRulesArray.forEach((distinctItemAndRules) => {
      // Identify 'discount price' rule
      const disCountedPriceRule = distinctItemAndRules.rules.find(
        (rule) => rule.ruleType === PRICERULESTYPES.DISCOUNTED_PRICE
      )
      // If there is a discount price for item, take it else fall back to original price
      const itemPrice = disCountedPriceRule?.ruleConfig.discountedPrice || distinctItemAndRules.item.price
      // Identify if there is any 'bulk buy' rule available for the product type
      const bulkBuyDiscountRule = distinctItemAndRules.rules.find((rule) => rule.ruleType === PRICERULESTYPES.BULK_BUY)

      // If 'bulk' buy rule is eligible adjus the quantity as per the rule configuration EX: 5 for 4 -> qty = 4
      let itemQuantity = distinctItemAndRules.item.qty
      if (bulkBuyDiscountRule?.ruleConfig.eligibleQuantity === distinctItemAndRules.item.qty)
        itemQuantity = bulkBuyDiscountRule?.ruleConfig.discountedQuantity

      // cumulative addition of prices based on the rules above
      if (itemPrice && itemQuantity) checkOutTotal += itemPrice * itemQuantity
    })

    // update private variable checkOutTotal
    this.checkOutTotal = checkOutTotal
  }

  /**
   *
   * @returns { item: CheckOutItem; rules: PricingRule[] }[]
   * Segregate chekcout items by their product type.
   * This funtion returns an array (distinctItemsAndRulesArray) that has max 3 elements one for each produt type (classic | standout | premium) along with their quantity.
   * Example: 
       [{
          "item": {
            "productId": "standout",
            "price": 322.99,
            "productName": "Stand out Ad",
            "qty": 5
          },
          "rules": [
            {
              "customerId": "myer",
              "products": ["standout"],
              "ruleType": "bulkbuy",
              "ruleConfig": { "eligibleQuantity": 5, "discountedQuantity": 4 }
            }
          ]
        }]
   */
  private determineDistinctItemsAndRules(): { item: CheckOutItem; rules: PricingRule[] }[] {
    const distinctItemsAndRulesArray: { item: CheckOutItem; rules: PricingRule[] }[] = []
    this.items.forEach((item) => {
      const itemExists = distinctItemsAndRulesArray.find((aryItem) => aryItem.item.productId === item.productId)
      if (itemExists) {
        distinctItemsAndRulesArray.splice(distinctItemsAndRulesArray.indexOf(itemExists))
        distinctItemsAndRulesArray.push({
          item: { ...itemExists.item, qty: (itemExists.item?.qty || 0) + 1 },
          rules: itemExists.rules,
        })
      } else {
        distinctItemsAndRulesArray.push({
          item: { ...item, qty: 1 },
          rules: this.rules.filter((rule) => {
            return rule.products.includes(item.productId)
          }),
        })
      }
    })
    return distinctItemsAndRulesArray
  }
}
