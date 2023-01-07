import { Express } from 'express'
import { chekoutController } from './controller/checkOutController'

export default (app: Express) => {
  //Create  Checkout
  app.post('/checkout', chekoutController)
}
