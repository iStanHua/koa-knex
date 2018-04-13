'use strict'

const crypto = require('crypto')
const fs = require('fs')
const Path = require('path')
const uuid1 = require('uuid/v1')
const request = require('request')


const Controller = require('./index')

const fetch = require('../extends/request')

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
  _token(appid, secret) {
    return new Promise((resolve, reject) => {
      fetch.get({
        url: `${this.baseUrl}cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }

  /**
   * 获取ticket
   * @param {String} access_token  小程序的 access_token
   * @param {String} type          类型(jsapi,wx_card)
   */
  _ticket(access_token, type = 'jsapi') {
    return new Promise((resolve, reject) => {
      fetch.get({
        url: `${this.baseUrl}cgi-bin/ticket/getticket?access_token=${access_token}&type=${type}`
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }

  /**
   * 获取access_token
   * @param {String} appid   小程序唯一标识
   * @param {String} secret  小程序的 app secret
   */
  async token(ctx, next) {
    let _body = { code: 200 }
    let { appid, secret } = ctx.query
    if (!appid) {
      return this.success(ctx, this.errorInfo.required('appid'))
    }
    if (!secret) {
      return this.success(ctx, this.errorInfo.required('secret'))
    }
    let result = await this._token(appid, secret)
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
  * @param {String} appid   小程序唯一标识
  * @param {String} secret  小程序的 app secret
  * @param {String} type    类型(jsapi,wx_card)
  */
  async getTicket(ctx, next) {
    let _body = { code: 200 }
    let { appid, secret, type } = ctx.query
    if (!appid) {
      return this.success(ctx, this.errorInfo.required('appid'))
    }
    if (!secret) {
      return this.success(ctx, this.errorInfo.required('secret'))
    }

    let result = await this._token(appid, secret)
    if (result.errcode) {
      _body.code = result.errcode
      _body.data = result.errmsg
    }
    else {
      result = await this._ticket(result.access_token, type)
      if (result.errcode) {
        _body.code = result.errcode
        _body.data = result.errmsg
      }
      else {
        _body.data = result
      }
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
    let _body = { code: 200 }
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
    let result = await this._token(appid, secret)
    if (result.errcode) {
      _body.code = result.errcode
      _body.data = result.errmsg
    }
    else {
      result = await this._ticket(result.access_token)
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
   * 获取用户openid
   * @param {String} appid   小程序唯一标识
   * @param {String} secret  小程序的 app secret
   * @param {String} code    用户登录凭证（有效期五分钟）
   */
  async getOpenid(ctx, next) {
    let _body = { code: 200 }
    let { appid, secret, code } = ctx.query
    // if (!appid) {
    //   return this.success(ctx, this.errorInfo.required('appid'))
    // }
    // if (!secret) {
    //   return this.success(ctx, this.errorInfo.required('secret'))
    // }
    appid = appid || this.appid
    secret = secret || this.secret
    if (!code) {
      return this.success(ctx, this.errorInfo.required('code'))
    }
    let result = await fetch.get({
      url: `${this.baseUrl}sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`
    })
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
    let _body = { code: 200 }
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

    let result = await this._token(appid, secret)
    if (result.errcode) {
      _body.code = result.errcode
      _body.data = result.errmsg
    }
    else {
      let _token = result.access_token
      let _fileName = '/upload/qrcode/' + uuid1().toString().replace(/-/g, '') + '.png'
      await fetch.request({
        method: 'POST',
        url: `${this.baseUrl}wxa/getwxacodeunlimit?access_token=${_token}`,
        body: JSON.stringify(_data)
      }).on('error', (err) => {
        return this.success(ctx, this.errorInfo.serverError())
      }).pipe(fs.createWriteStream(Path.join(process.cwd(), 'public' + _fileName)))
      _body.data = _fileName
    }
    this.success(ctx, _body)
  }

}
module.exports = new WxController()