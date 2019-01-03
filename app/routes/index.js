'use strict'

const router = require('koa-router')()

router.prefix('/api')

const user = require('./user')
const brand = require('./brand')

router.use(user.routes(), user.allowedMethods())
router.use(brand.routes(), brand.allowedMethods())

module.exports = router