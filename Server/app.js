'use strict'

import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware'
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(awsServerlessExpressMiddleware.eventContext())

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ msg: 'stuff!'})
})


app.use('/', router)

module.exports = app
