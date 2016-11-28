'use strict'

import awsServerlessExpress from 'aws-serverless-express'

const appPromise = require('../app')

exports.handler = (event, context) => {
  console.log('EVENT')
  console.log(event)
  console.log('CONTEXT')
  console.log(context)

  appPromise.then((app) => {
    console.log('APP')
    console.log(app)
    return new Promise((resolve, reject) => {
      resolve(awsServerlessExpress.createServer(app))
    })
  }).then((server) => {
    console.log('SERVER')
    console.log(server)
    awsServerlessExpress.proxy(server, event, context)
  }).catch((err) => {
    console.log('Failure!')
    console.log(err)
    context.fail(err)
  })
}
