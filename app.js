'use strict'

const Koa = require('koa')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser') // 传参获取
const json = require('koa-json')
const logger = require('koa-logger')
const cors = require('koa-cors') // 跨域处理
const favicon = require('koa-favicon')

const port = 8080

const contexts = require('./app/extend/context')
const routes = require('./app/router')
const response = require('./app/middlewares/response')

const app = new Koa()

// error handler
onerror(app)
// context
contexts(app)

// middlewares
// 解析请求体
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(cors())
app.use(favicon(__dirname + '/public/logo.jpg'))
app.use(require('koa-static')(__dirname + '/public'))
// router
app.use(routes.routes(), routes.allowedMethods())

// 使用响应处理中间件
app.use(response)


// logger
app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.error(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
})

app.listen(port, () => {
    console.log(`Listening on http://127.0.0.1:${port}`)
})

module.exports = app