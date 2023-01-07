import { Request, Response } from 'express'
import { Checkout } from '../services/checkOutService'
import pricingRules from '../config/pricingRules.json'
import log from '../logger'

import { checkOutRequestSchema } from '../schema/checkOutSchema'

export const chekoutController = async (req: Request, res: Response) => {
  try {
    log.info(req.body)
    const { error, value } = checkOutRequestSchema.validate(req.body, { abortEarly: false })
    if (error) res.status(400).send({ code: 'invalid request', details: error })
    log.info(value)
    const customerId = value.customerId

    const eligibleRules = pricingRules.rules.filter((rule) => rule.customerId === customerId)

    const checkout = new Checkout(eligibleRules)

    const checkoutItems = value.items as string[]
    checkoutItems.forEach((item) => checkout.add({ productId: item }))

    //Customer: default
    //checkout.add({ productId: 'classic' })
    //checkout.add({ productId: 'standout' })
    //checkout.add({ productId: 'premium' })

    //Customer: SecondBite
    //checkout.add({ productId: 'classic' })
    //checkout.add({ productId: 'classic' })
    //checkout.add({ productId: 'classic' })
    //checkout.add({ productId: 'premium' })

    //Customer: Axil Coffee Roasters
    //checkout.add({ productId: 'standout' })
    //checkout.add({ productId: 'standout' })
    //checkout.add({ productId: 'standout' })
    //checkout.add({ productId: 'premium' })

    //Customer: Myer
    //checkout.add({ productId: 'standout' })
    //checkout.add({ productId: 'standout' })
    //checkout.add({ productId: 'standout' })
    //checkout.add({ productId: 'standout' })
    //checkout.add({ productId: 'standout' })
    //checkout.add({ productId: 'premium' })
    //checkout.add({ productId: 'premium' })

    console.log(checkout.total())
    res.status(200).send({ total: checkout.total() })
  } catch (error) {
    log.info(`error: ${error}`)
  }
}
