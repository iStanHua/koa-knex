const router = require('koa-router')()
const Wx = require('../controllers/wx')

router.prefix('/wx')

router.get('/token', Wx.token.bind(Wx))
router.get('/ticket', Wx.getTicket.bind(Wx))
router.get('/signature', Wx.getSignature.bind(Wx))
router.get('/openid', Wx.getOpenid.bind(Wx))


router.get('/qrcode', Wx.wxaQrcode.bind(Wx))

module.exports = router 