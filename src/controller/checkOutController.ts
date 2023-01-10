import { Request, Response } from 'express'
import { CheckoutService } from '../services/checkOutService'
import pricingRules from '../config/pricingRules.json'
import log from '../logger'

import { checkOutRequestSchema } from '../schema/checkOutSchema'

export const chekoutController = async (req: Request, res: Response) => {
  try {
    const { error, value } = checkOutRequestSchema.validate(req.body, { abortEarly: false })
    if (error) res.status(400).send({ code: 'invalid request', details: error })

    const customerId = value.customerId

    const eligibleRules = pricingRules.rules.filter((rule) => rule.customerId === customerId)

    const checkout = new CheckoutService(eligibleRules)

    const checkoutItems = value.items as string[]
    checkoutItems.forEach((item) => checkout.add({ productId: item }))

    res.status(200).send({ total: checkout.total() })
  } catch (error) {
    log.error(`error: ${error}`)
  }
}
