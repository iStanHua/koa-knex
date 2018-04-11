'use strict'

const router = require('koa-router')()

router.prefix('/api')

const wx = require('./wx')

const user = require('./user')
const brand = require('./brand')

router.use(wx.routes(), wx.allowedMethods())

router.use(user.routes(), user.allowedMethods())
router.use(brand.routes(), brand.allowedMethods())

module.exports = router