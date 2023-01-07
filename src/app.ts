import log from './logger'

import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import routes from './routes'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const port = (process.env.PORT || 3000) as number
const host = process.env.HOST || 'localhost'
app.listen(port, host, () => {
  log.info(`Server listening at http://${host}:${port}`)
  routes(app)
})
