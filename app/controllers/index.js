'use strict'

class Controller {
    constructor() {
        this.md5 = require('../extends/md5')
        this.validate = require('../extends/validate')
        this.errorInfo = require('../extends/errorInfo')
    }
    /**
     * 权限值
     */
    getAuth(ctx) {
        return ctx.get('Authorization')
    }
    /**
     * 验证权限
     */
    async checkAuth(ctx) {
        return await ctx.redis.get(this.getAuth(ctx))
    }
    /**
     * 输出格式化
     */
    success(ctx, options) {
        ctx.body = {
            code: options.code,
            data: options.data
        }
    }
    /**
   * 通用
   */
    common(ctx, data) {
        let _body = { code: 1002, data: data }
        return this.success(ctx, _body)
    }
    /**
     * 长度区间
     */
    rangeLength(ctx, name, min, max) {
        let _body = { code: 1002, data: '%s长度必须在%s-%s位之间' }
        _body.data = this.errorInfo.util.format(_body.data, name, min, max)
        return this.success(ctx, _body)
    }
    /**
     * 长度最小
     */
    minLength(ctx, name, min) {
        let _body = { code: 1002, data: '%s长度最小为%s' }
        _body.data = this.errorInfo.util.format(_body.data, name, min)
        return this.success(ctx, _body)
    }
    /**
     * 长度最大
     */
    maxLength(ctx, name, max) {
        let _body = { code: 1002, data: '%s长度最多为%s' }
        _body.data = this.errorInfo.util.format(_body.data, name, max)
        return this.success(ctx, _body)
    }
    /**
     * 值区间
     */
    range(ctx, name, min, max) {
        let _body = { code: 1002, data: '%s值必须在%s-%s之间' }
        _body.data = this.errorInfo.util.format(_body.data, name, min, max)
        return this.success(ctx, _body)
    }
    /**
     * 最小
     */
    min(ctx, name, min) {
        let _body = { code: 1002, data: '%s值不能小于%s' }
        _body.data = this.errorInfo.util.format(_body.data, name, min)
        return this.success(ctx, _body)
    }
    /**
     * 最大
     */
    max(ctx, name, max) {
        let _body = { code: 1002, data: '%s值不能大于%s' }
        _body.data = this.errorInfo.util.format(_body.data, name, max)
        return this.success(ctx, _body)
    }
    /**
     * 纯数字
     */
    pureNumber(ctx, name) {
        let _body = { code: 1002, data: '%s不能为纯数字' }
        _body.data = this.errorInfo.util.format(_body.data, name)
        return this.success(ctx, _body)
    }
}

module.exports = Controller