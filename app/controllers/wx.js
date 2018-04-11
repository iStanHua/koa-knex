'use strict'

const crypto = require('crypto')
const fs = require('fs')
const Path = require('path')
const uuid1 = require('uuid/v1')
const request = require('request')


const Controller = require('./index')

const { fetch } = require('../extends/request')

class WxController extends Controller {
  constructor() {
    super()
    this.baseUrl = 'https://api.weixin.qq.com/'

    this.appid = 'wxfd57b05dd6dec87e'
    this.secret = '2089b5d0e0753a6f359df69412d63b39'
  }

  /**
   * 获取access_token
   * @param {String} appid   小程序唯一标识
   * @param {String} secret  小程序的 app secret
   */
  async accessToken(ctx, next) {
    let _body = { code: 200, data: '' }
    let { appid, secret } = ctx.query
    let result = await fetch(`${this.baseUrl}cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`)
    if (result.errcode) {
      _body.code = result.errcode
      _body.data = result.errmsg
    }
    else {
      _body.data = result
    }
    this.success(ctx, _body)
  }

  /**
  * 获取ticket
  * @param {String} type          类型(jsapi,wx_card)
  * @param {String} access_token  调用接口凭证
  */
  async getTicket(ctx, next) {
    let _body = { code: 200, data: '' }
    let { access_token, type } = ctx.query
    let result = await fetch(`${this.baseUrl}cgi-bin/ticket/getticket?access_token=${access_token}&type=${type}`)
    if (result.errcode) {
      _body.code = result.errcode
      _body.data = result.errmsg
    }
    else {
      _body.data = result
    }
    this.success(ctx, _body)
  }

  /**
  * 获取signature
  * @param {String} appid   小程序唯一标识
  * @param {String} secret  小程序的 app secret
  * @param {String} url     需要调用 JS 接口的 URL
  */
  async getSignature(ctx, next) {
    let _body = { code: 200, data: '' }
    let { appid, secret, url } = ctx.query
    if (!appid) {
      return this.success(ctx, this.errorInfo.required('appid'))
    }
    if (!secret) {
      return this.success(ctx, this.errorInfo.required('secret'))
    }
    if (!url) {
      return this.success(ctx, this.errorInfo.required('url'))
    }
    let result = await fetch(`${this.baseUrl}cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`)
    if (result.errcode) {
      _body.code = result.errcode
      _body.data = result.errmsg
    }
    else {
      let _token = result.access_token
      result = await fetch(`${this.baseUrl}cgi-bin/ticket/getticket?access_token=${_token}&type=jsapi`)
      if (result.errcode) {
        _body.code = result.errcode
        _body.data = result.errmsg
      }
      else {
        let _ticket = result.ticket
        const timestamp = Math.floor(Date.now() / 1000)
        const noncestr = Math.random().toString(36).substring(2)
        const source = `jsapi_ticket=${_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`
        const signature = crypto.createHash('sha1').update(source).digest('hex')
        _body.data = { appid: appid, jsapi_ticket: _ticket, timestamp, noncestr, signature }
      }
    }
    this.success(ctx, _body)
  }

  /**
   * 获取access_token
   * @param {String} appid   小程序唯一标识
   * @param {String} secret  小程序的 app secret
   */
  async jscode2session(ctx, next) {
    let _body = { code: 200, data: '' }
    let { appid, secret } = ctx.query

    let result = await fetch(`${this.baseUrl}sns/jscode2session?appid=${appid}&secret=${secret}&js_code=JSCODE&grant_type=authorization_code`)
    if (result.errcode) {
      _body.code = result.errcode
      _body.data = result.errmsg
    }
    else {
      _body.data = result
    }
    this.success(ctx, _body)
  }

  /**
   * 获取小程序二维码
   * @param {String} appid        小程序唯一标识
   * @param {String} secret       小程序的 app secret
   * @param {String} scene        小程序对应的页面
   * @param {String} path         小程序对应的页面
   * @param {Number} width        二维码宽度 430
   * @param {Boolean} auto_color  自动配置线条颜色
   * @param {Object} line_color   {"r":"0","g":"0","b":"0"}
   */
  async wxaQrcode(ctx, next) {
    let _body = { code: 200, data: '' }
    let _data = {}
    let { appid, secret, scene, path, width, auto_color, line_color } = ctx.query
    if (!appid) {
      return this.success(ctx, this.errorInfo.required('appid'))
    }
    if (!secret) {
      return this.success(ctx, this.errorInfo.required('secret'))
    }
    if (!path) {
      return this.success(ctx, this.errorInfo.required('path'))
    }
    else {
      _data.path = path
    }

    if (!scene) {
      return this.success(ctx, this.errorInfo.required('scene'))
    }
    else {
      _data.scene = decodeURIComponent(scene)
    }
    if (width) {
      _data.width = width
    }

    if (auto_color) {
      _data.auto_color = auto_color
    }

    if (line_color) {
      _data.line_color = line_color
    }

    let result = await fetch(`${this.baseUrl}cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`)
    if (result.errcode) {
      _body.code = result.errcode
      _body.data = result.errmsg
    }
    else {
      let _token = result.access_token
      let _fileName = '/upload/qrcode/' + uuid1().toString().replace(/-/g, '') + '.png'
      await fetch(`${this.baseUrl}wxa/getwxacodeunlimit?access_token=${_token}`, 'post', data).then(data => {
        data.pipe(fs.createWriteStream(Path.join(process.cwd(), 'public' + _fileName)))
        _body.data = _fileName
      }).catch(err => {
        return this.success(ctx, this.errorInfo.serverError())
      })
    }
    this.success(ctx, _body)
  }
}
module.exports = new WxController()