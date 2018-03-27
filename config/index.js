'use strict'

const knexfile = require('./knexfile')
const NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = {
  db: knexfile[NODE_ENV],
  cors: {
    origin: '*',
    exposeHeaders: ['Authorization'],
    credentials: true,
    allowMethods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowHeaders: ['Authorization', 'Content-Type'],
    keepHeadersOnError: true
  },
  server: {
    port: 3000,
    host: 'localhost'
  }
}