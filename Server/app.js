'use strict'

import aws from 'aws-sdk'
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
const dynamodb = new aws.DynamoDB({
  region: 'us-west-2'
})
const docClient = new aws.DynamoDB.DocumentClient({
  service: dynamodb
})

function filterUser(user) {
  const copy = _.cloneDeep(user)

  delete copy.exp;
  delete copy.iat;

  copy.userId = crypto.createHmac('sha256', copy.sub).digest('hex')
  delete copy.sub

  return copy
}

function getResp(msg) {
  const resp = _.cloneDeep(msg)
  delete resp.userPrivate
  return resp
}

console.log('App initialized...')

function configure(app, auth0Secret) {
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

  router.get('/message', (req, res) => {
    docClient.scan({
      TableName: 'chickchat',
      ConsistentRead: true,
    }).promise().then((data) => {
      console.log('Found ' + data.Count + ' items in chickchat table')
      const items = data.Items.map(getResp)
      items.sort((a, b) => {
        return a.timestampUtc - b.timestampUtc
      })
      res.json({
        messages: items,
        count: items.length,
      })
    }).catch((err) => {
      console.log(err)
      res.status(500).json({ message: err.message })
    })
  })

  router.post('/message', (req, res) => {
    const msg = {
      messageId: uuid.v4(),
      text: req.body.text || null,
      data: req.body.data || null,
      author: filterUser(req.user),
      userPrivate: req.user,
      timestampUtc: Date.now(),
    }

    docClient.put({
      TableName: 'chickchat',
      Item: msg,
    }).promise().then(() => {
      const resp = getResp(msg)
      res.json(resp)
    }).catch((err) => {
      console.log('Failed to put item in DynamoDB.')
      console.log(err)
      res.status(500).json({ msg: err.message })
    })
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
