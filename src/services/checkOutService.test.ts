import { CheckoutService } from './checkOutService'
import pricingRules from '../config/pricingRules.json'

const nonPrevilegedCustomer = 'default'

describe('checkout service', () => {
  describe('no eligible pricing rules available for items in a checkout', () => {
    it('calculates correct total when single item exists in a checkout', async () => {
      const eligibleRules = pricingRules.rules.filter((rule) => rule.customerId === nonPrevilegedCustomer)
      const service = new CheckoutService(eligibleRules)
      service.add({ productId: 'classic' }) //original price: 269.99
      expect(service.total()).toEqual(269.99)
    })
    it('calculates correct total when multiple items exists in a checkout', async () => {
      const eligibleRules = pricingRules.rules.filter((rule) => rule.customerId === nonPrevilegedCustomer)
      const service = new CheckoutService(eligibleRules)
      service.add({ productId: 'classic' }) //original price: 269.99
      service.add({ productId: 'standout' }) //original price: 322.99
      service.add({ productId: 'premium' }) //original price: 394.99
      expect(service.total()).toEqual(987.97)
    })
  })

  describe('eligible pricing rules available for items in a checkout', () => {
    it('calculates correct total when single item exists in a checkout', async () => {
      const eligibleRules = pricingRules.rules.filter((rule) => rule.customerId === 'myer')
      const service = new CheckoutService(eligibleRules)
      //original price for premium product is : 394.99
      service.add({ productId: 'premium' })
      //since discount rule in place for myer with a preium product, total equals to 389.99
      expect(service.total()).toEqual(389.99)
    })

    it('calculates correct total when multiple items exists in a checkout', async () => {
      const eligibleRules = pricingRules.rules.filter((rule) => rule.customerId === 'myer')
      const service = new CheckoutService(eligibleRules)
      // 5 for 4 bulk discount applicable for 'standout' products
      service.add({ productId: 'standout' }) //original price: 322.99
      service.add({ productId: 'standout' }) //original price: 322.99
      service.add({ productId: 'standout' }) //original price: 322.99
      service.add({ productId: 'standout' }) //original price: 322.99
      service.add({ productId: 'standout' }) //original price: 322.99
      service.add({ productId: 'premium' }) //original price: 394.99, discounted price: 389.99
      expect(service.total()).toEqual(1681.95)
    })

    it('calculates correct total when checkout item(s) only have a bulk buy pricing rule', async () => {
      const eligibleRules = pricingRules.rules.filter((rule) => rule.customerId === 'second-bite')
      const service = new CheckoutService(eligibleRules)
      // 3 for 2 bulk discount applicable for 'classic' ads
      service.add({ productId: 'classic' }) //original price: 269.99
      service.add({ productId: 'classic' }) //original price: 269.99
      service.add({ productId: 'classic' }) //original price: 269.99
      expect(service.total()).toEqual(539.98)
    })

    it('calculates correct total when checkout item(s) only have a discount pricing rule', async () => {
      const eligibleRules = pricingRules.rules.filter((rule) => rule.customerId === 'axil-coffee-roasters')
      const service = new CheckoutService(eligibleRules)
      // a discounted price 299.99 offered for 'standout' ads
      service.add({ productId: 'standout' }) //original price: 322.99, discounted price: 299.99
      service.add({ productId: 'classic' }) //original price: 269.99
      expect(service.total()).toEqual(569.98)
    })
    it('calculates correct total when checkout item(s) have both bulkbuy and discount pricing rules', async () => {
      const eligibleRules = pricingRules.rules.filter((rule) => rule.customerId === 'myer')
      const service = new CheckoutService(eligibleRules)
      // 5 for 4 bulk discount applicable for 'standout' products
      // 2 for 1 bulk discount applicable for 'premium' products in addition to discount price
      service.add({ productId: 'standout' }) //original price: 322.99
      service.add({ productId: 'standout' }) //original price: 322.99
      service.add({ productId: 'standout' }) //original price: 322.99
      service.add({ productId: 'standout' }) //original price: 322.99
      service.add({ productId: 'standout' }) //original price: 322.99
      service.add({ productId: 'premium' }) //original price: 394.99, discounted price: 389.99
      service.add({ productId: 'premium' }) //original price: 394.99, discounted price: 389.99
      expect(service.total()).toEqual(1681.95)
    })
  })
})
