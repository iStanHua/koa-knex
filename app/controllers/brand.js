'use strict'

const Controller = require('./index')
const Brand = require('../services/brand')

class BrandController extends Controller {
  constructor() {
    super()
  }

  /**
   * 新增品牌
   * @param {String} name      名称
   * @param {String} image     图片
   * @param {Number} sort      排序
   */
  async add(ctx, next) {
    let _body = { code: 200, data: '新增成功' }
    if (await this.checkAuth(ctx)) {
      let { name } = ctx.request.body
      if (!name) {
        return this.success(ctx, this.errorInfo.required('品牌名'))
      }
      let result = await Brand.addBrand(ctx.request.body)
      if (result && result.code) {
        _body = result
      }
      else {
        _body.data = result
      }
    }
    else {
      _body = this.errorInfo.unauthorized()
    }
    this.success(ctx, _body)
  }

  /**
   * 修改品牌
   * @param {Number} id        编号
   * @param {String} name      名称
   * @param {String} image     图片
   * @param {Number} sort      排序
   */
  async update(ctx, next) {
    let _body = { code: 200, data: '修改成功' }
    if (await this.checkAuth(ctx)) {
      let { id } = ctx.params
      if (id && isNaN(Number(id))) {
        return this.success(ctx, this.errorInfo.invalid('编号'))
      }
      let result = await Brand.updateBrand(parseInt(id), ctx.request.body)
      if (result && result.code) {
        _body = result
      }
    }
    else {
      _body = this.errorInfo.unauthorized()
    }
    this.success(ctx, _body)
  }

  /**
  * 删除品牌
  * @param {Number}  id    品牌编号
  * @param {Boolean} flag  是否真删
  */
  async delete(ctx, next) {
    let _body = { code: 200, data: '删除成功' }
    if (await this.checkAuth(ctx)) {
      let { id } = ctx.params
      if (id && isNaN(Number(id))) {
        return this.success(ctx, this.errorInfo.invalid('编号'))
      }
      let { flag } = ctx.request.body
      let result = await Brand.deleteBrand(parseInt(id), flag)
      if (result && result.code) {
        _body = result
      }
    }
    else {
      _body = this.errorInfo.unauthorized()
    }
    this.success(ctx, _body)
  }

  /**
   * 品牌详情
   * @param {Number} id   编号
   */
  async detail(ctx, next) {
    let _body = { code: 200, data: '' }
    let { id } = ctx.params
    if (id && isNaN(Number(id))) {
      return this.success(ctx, this.errorInfo.invalid('编号'))
    }
    let result = await Brand.brandDetail(parseInt(id))
    if (result && result.code) {
      _body = result
    }
    else {
      _body.data = result
    }
    this.success(ctx, _body)
  }

  /**
   * 品牌列表
   * @param {String} data.name   名称
   * @param {Number} page_index  页码索引
   * @param {Number} page_size   每页显示记录数
   */
  async list(ctx, next) {
    let _body = { code: 200, data: '' }
    let result = await Brand.brandList(ctx.query)
    if (result && result.code) {
      _body = result
    }
    else {
      _body.data = result
    }
    this.success(ctx, _body)
  }
  /**
   * 品牌全部列表
   */
  async all(ctx, next) {
    let _body = { code: 200, data: '' }
    let result = await Brand.brandAll()
    if (result && result.code) {
      _body = result
    }
    else {
      _body.data = result
    }
    this.success(ctx, _body)
  }
}
module.exports = new BrandController()