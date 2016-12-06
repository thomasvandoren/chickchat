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
import dataUri from 'strong-data-uri'

const app = express()
const awsRegion = 'us-west-2';
const dynamodb = new aws.DynamoDB({
  region: awsRegion
})
const docClient = new aws.DynamoDB.DocumentClient({
  service: dynamodb
})
const s3Client = new aws.S3({
  region: awsRegion
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
  app.use(bodyParser.json({
    limit: '25MB',
  }))
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(awsServerlessExpressMiddleware.eventContext())
  app.use(morgan('combined'))

  const router = express.Router()

  const authenticate = jwt({
    secret: new Buffer(auth0Secret, 'base64'),
    issuer: 'https://chickchat.auth0.com/',
    audience: '5mEPvtSaOrH23TKWEebEBZZkHcE4N072',
    credentialsRequired: true,
  })

  router.get('/', (req, res) => {
    res.json({ healthy: true })
  })

  router.get('/message', authenticate, (req, res) => {
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

  router.post('/message', authenticate, (req, res) => {
    const msg = {
      messageId: uuid.v4(),
      text: req.body.text || null,
      data: req.body.data || null,
      author: filterUser(req.user),
      userPrivate: req.user,
      timestampUtc: Date.now(),
    }
    const putToDynamo = (msg) => {
      console.log('Putting document in dynamo!')
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
    }

    // Upload data blob to S3, then store URL for object as data.
    if (msg.data === null) {
      putToDynamo(msg)
    } else {
      console.log('Parsing data uri...')
      const dataParsed = dataUri.decode(msg.data)
      const fileExt = dataParsed.mimetype.split('/')[1]
      const dataKey = uuid.v4() + '.' + fileExt
      const bucketName = 'chickchat-data'
      const dataBody = Buffer.from(dataParsed.buffer, 'base64')

      console.log('Uploading key to s3: ' + dataKey)
      s3Client.putObject({
        Bucket: bucketName,
        Key: dataKey,
        Body: dataBody,
        ContentEncoding: 'base64',
        ContentType: dataParsed.mimetype,
      }).promise().then((data) => {
        console.log('Setting acl on key: ' + dataKey)
        return s3Client.putObjectAcl({
          Bucket: bucketName,
          Key: dataKey,
          ACL: 'public-read',
        }).promise()
      }).then((data) => {
        const dataNewLoc = 'https://s3-' + awsRegion + '.amazonaws.com/' + bucketName + '/' + dataKey
        console.log('Successfully upload object to s3: ' + dataNewLoc)
        const updatedMsg = Object.assign({}, msg, {data: dataNewLoc})
        putToDynamo(updatedMsg)
      }).catch((err) => {
        console.log('Failed to upload image to S3!')
        console.log(err);
        res.status(500).json({ msg: err.message })
      })
    }
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
