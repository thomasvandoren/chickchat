'use strict'

import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import jwt from 'express-jwt'
import {getAuth0Secret} from './helpers/kmsTools'

const app = express()

const configure = (app, auth0Secret) => {
  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(awsServerlessExpressMiddleware.eventContext())

  const router = express.Router()

  router.all('*', jwt({
    secret: new Buffer(auth0Secret, 'base64'),
    issuer: 'https://chickchat.auth0.com/',
    audience: '5mEPvtSaOrH23TKWEebEBZZkHcE4N072',
    credentialsRequired: true,
  }))

  router.get('/', (req, res) => {
    console.log(req.user)

    res.json({ msg: 'stuff!'})
  })

  router.get('/message', (req, res) => {
    console.log(req.user)

    res.json({
      messages: []
    })
  })

  router.post('/message', (req, res) => {
    console.log(req.user)

    res.status(404).send('not yet!')
  })

  app.use('/', router)

  app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({ msg: err.message })
    }
  })
}


getAuth0Secret().then((data) => {
  configure(app, data)
}).catch((err) => {
  throw new Error(err)
})

module.exports = app
