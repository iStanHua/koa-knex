const router = require('koa-router')()
const Brand = require('../controllers/brand')

router.prefix('/brand')

router.get('/all', Brand.all.bind(Brand))
router.get('/list', Brand.list.bind(Brand))
router.get('/detail/:id', Brand.detail.bind(Brand))

router.post('/add', Brand.add.bind(Brand))
router.post('/update/:id', Brand.update.bind(Brand))
router.post('/delete/:id', Brand.delete.bind(Brand))

module.exports = router 