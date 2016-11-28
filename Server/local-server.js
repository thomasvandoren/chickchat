import appPromise from './app'

const port = process.env.API_PORT || 3001
appPromise.then((app) => {
  app.listen(port)
  console.log('Service is listening on ' + port)
}).catch((err) => {
  throw new Error(err)
})
