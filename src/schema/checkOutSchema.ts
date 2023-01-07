import Joi from 'joi'
import { PRODUCTTYPES } from '../config/constantans'

export const checkOutRequestSchema = Joi.object({
  customerId: Joi.string().required(),
  items: Joi.array()
    .min(1)
    .items(Joi.string().valid(PRODUCTTYPES.CLASSIC, PRODUCTTYPES.STANDOUT, PRODUCTTYPES.PREMIUM))
    .required(),
}).unknown()
