'use strict'

import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import jwt from 'express-jwt'
import {getAuth0Secret} from './helpers/kmsTools'

const app = express()

getAuth0Secret().then((data) => {
  app.use(jwt({
    secret: auth0Secret,
    credentialsRequired: true,
  }))
}).catch((err) => {
  throw new Error(err)
})

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
