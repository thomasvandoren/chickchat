'use strict'

import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import jwt from 'express-jwt'
import {getAuth0Secret} from './helpers/kmsTools'
import morgan from 'morgan'
import uuid from 'node-uuid'
import _ from 'lodash'
import crypto from 'crypto'

const app = express()

const filterUser = (user) => {
  const copy = _.cloneDeep(user)

  delete copy.exp;
  delete copy.iat;

  copy.userId = crypto.createHmac('sha256', copy.sub).digest('hex')
  delete copy.sub

  return copy
}

console.log('App initialized...')

const configure = (app, auth0Secret) => {
  console.log('Configuring express app...')
  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(awsServerlessExpressMiddleware.eventContext())
  app.use(morgan('combined'))

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
    const msg = {
      messageId: uuid.v4(),
      text: req.body.text,
      data: req.body.data,
      author: filterUser(req.user),
      userPrivate: req.user,
    }

    res.json(msg)
  })

  app.use('/', router)

  app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({ msg: err.message })
    }
  })
}

module.exports = new Promise((resolve, reject) => {
  const p = getAuth0Secret().then((data) => {
    configure(app, data)
    resolve(app)
  }).catch((err) => {
    reject(err)
  })
})
