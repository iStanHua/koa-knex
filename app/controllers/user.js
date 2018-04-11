'use strict'

const Controller = require('./index')
const User = require('../services/user')

class UserController extends Controller {
  constructor() {
    super()
  }

  /**
   * 新增用户
   * @param {String} name            用户名
   * @param {String} gender          性别
   * @param {String} avatar          头像
   * @param {String} password        密码
   * @param {String} phone           手机号
   * @param {String} email           邮箱
   * @param {Number} created_time    创建时间
   * @param {Number} updated_time    修改时间
   */
  async add(ctx, next) {
    let _body = { code: 200, data: '新增成功' }
    let { name, gender, avatar, password, phone, email, created_time, updated_time } = ctx.request.body
    if (!name) {
      return this.success(ctx, this.errorInfo.required('用户名'))
    }
    else if (name.length < 2 || name.length > 17) {
      return this.rangeLength(ctx, '用户名', 3, 16)
    }
    else if (this.validate.pureNumber(name)) {
      return this.pureNumber(ctx, '用户名')
    }
    if (!password) {
      return this.success(ctx, this.errorInfo.required('密码'))
    }
    else if (password.length < 7 || password.length > 31) {
      return this.rangeLength(ctx, '密码', 8, 30)
    }
    else if (!this.validate.password(password)) {
      return this.common(ctx, '密码必须包含字母、数字和特殊字符')
    }
    if (gender) {
      if (isNaN(Number(gender))) {
        return this.range(ctx, '性别', 1, 3)
      }
      else if (Number(gender) < 1 || Number(gender) > 3) {
        return this.range(ctx, '性别', 1, 3)
      }
    }
    if (phone && !this.validate.phoneNumber(phone)) {
      return this.common(ctx, '手机号格式有误')
    }
    if (email && !this.validate.email(email)) {
      return this.common(ctx, '邮箱格式有误')
    }
    if (created_time && isNaN(Number(created_time))) {
      return this.common(ctx, '创建时间为数字')
    }
    if (updated_time && isNaN(Number(updated_time))) {
      return this.common(ctx, '修改时间为数字')
    }

    let result = await User.addUser(ctx.request.body)
    if (result && result.code) {
      _body = result
    }
    else {
      _body.data = result
    }
    this.success(ctx, _body)
  }

  /**
   * 修改用户
   * @param {Number} id              编号
   * @param {String} name            用户名
   * @param {String} gender          性别
   * @param {String} avatar          头像
   * @param {String} password        密码
   * @param {String} phone           手机号
   * @param {String} email           邮箱
   * @param {Number} updated_time    修改时间
   */
  async update(ctx, next) {
    let _body = { code: 200, data: '修改成功' }
    let { id } = ctx.params
    let { name, gender, avatar, password, phone, email } = ctx.request.body
    if (name) {
      if (name.length < 2 || name.length > 17) {
        return this.rangeLength(ctx, '用户名', 3, 16)
      }
      else if (this.validate.pureNumber(name)) {
        return this.pureNumber(ctx, '用户名')
      }
    }
    if (password) {
      if (password.length < 7 || password.length > 31) {
        return this.rangeLength(ctx, '密码', 8, 30)
      }
      else if (!this.validate.password(password)) {
        return this.common(ctx, '密码必须包含字母、数字和特殊字符')
      }
    }
    if (gender) {
      if (isNaN(Number(gender))) {
        return this.range(ctx, '性别', 1, 3)
      }
      else if (Number(gender) < 1 || Number(gender) > 3) {
        return this.range(ctx, '性别', 1, 3)
      }
    }
    if (phone && !this.validate.phoneNumber(phone)) {
      return this.common(ctx, '手机号格式有误')
    }
    if (email && !this.validate.email(email)) {
      return this.common(ctx, '邮箱格式有误')
    }

    let result = await User.updateUser(id, ctx.request.body)
    if (result && result.code) {
      _body = result
    }
    this.success(ctx, _body)
  }

  /**
  * 删除用户
  * @param {Number} id     用户编号
  * @param {Boolean} flag  是否真删
  * @returns result
  */
  async delete(id, flag = false) {
    let res = await User.count({ id: id })
    if (!res) {
      return this.success(ctx, this.errorInfo.unexist('用户'))
    }
    if (flag) {
      return await User.delete({ id: id })
    }
    else {
      return await this.update(id, { active: '0' })
    }
  }

  /**
   * 用户详情
   * @param {Number} id   编号
   */
  async detail(ctx, next) {
    let _body = { code: 200, data: '查询成功' }
    let { id } = ctx.params
    let result = await User.userDetail(id)
    if (result && result.code) {
      _body = result
    }
    else {
      _body.data = result
    }
    this.success(ctx, _body)
  }

  /**
   * 用户列表
   * @param {Number} page_index 页码索引
   * @param {Number} page_size  每页显示记录数
   */
  async list(ctx, next) {
    let _body = { code: 200, data: '查询成功' }
    let result = await User.userList(ctx.request.body)
    if (result && result.code) {
      _body = result
    }
    else {
      _body.data = result
    }
    this.success(ctx, _body)
  }

  /**
   * 用户登录
   *  @param {String} account    账号
   *  @param {String} password   密码
   */
  async login(ctx, next) {
    let _body = { code: 200, data: '登录成功' }
    let { account, password } = ctx.request.body
    let _data = {}
    if (!account) {
      return this.success(ctx, this.errorInfo.required('账号'))
    }
    else {
      if (this.validate.phoneNumber(account)) {
        _data.phone = account
      }
      else if (this.validate.email(account)) {
        _data.email = account
      }
      else {
        return this.success(ctx, this.errorInfo.wrongFormat('账号'))
      }
    }
    if (!password) {
      return this.success(ctx, this.errorInfo.required('密码'))
    }
    else {
      _data.password = this.md5(password)
    }
    let result = await User.login(_data)
    if (result.code) {
      _body = result
    }
    else {
      _body.data = result
    }
    this.success(ctx, _body)
  }

  /**
   * 用户注册
   *  @param {String} phone     手机号
   *  @param {String} email     邮箱
   *  @param {String} password  密码
   */
  async register(ctx, next) {
    let _body = { code: 200, data: '注册成功' }
    let { phone, email, password } = ctx.request.body
    if (phone && !this.validate.phoneNumber(phone)) {
      return this.success(ctx, this.errorInfo.wrongFormat('手机号'))
    }

    if (email && !this.validate.email(email)) {
      return this.success(ctx, this.errorInfo.wrongFormat('邮箱'))
    }
    if (!phone && !email) {
      return this.common(ctx, '请输入有效手机号或邮箱')
    }
    if (!password) {
      return this.success(ctx, this.errorInfo.required('密码'))
    }
    let result = await User.addUser(ctx.request.body)
    if (result.code) {
      _body = result
    }
    else {
      _body.data = result
    }
    this.success(ctx, _body)
  }
}
module.exports = new UserController()