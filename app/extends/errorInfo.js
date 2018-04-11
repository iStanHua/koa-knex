'use strict'

class errorInfo {
    constructor() {
        this.util = require('util')

        this.UNKNOWN = { code: -1, data: '未知错误' }
        this.ABNORMAL = { code: 0, data: '处理异常' }
        this.NOTFOUND = { code: 400, data: '未找到' }
        this.UNAUTHORIZED = { code: 401, data: '权限认证失败' }
        this.SERVEREORROR = { code: 500, data: '内部服务器错误' }
        this.NODATA = { code: 1000, data: '没有相关数据' }
        this.REQUIRED = { code: 1001, data: '%s不能为空' }
        this.FOUND = { code: 1002, data: '%s已存在' }
        this.INVALID = { code: 1003, data: '%s字段无效' }
        this.MISMATCH = { code: 1004, data: '%s和%s不匹配' }
        this.UNEXIST = { code: 1005, data: '%s不存在' }
        this.WRONGFORMAT = { code: 1006, data: '%s格式有误' }

    }
    /**
     * 未知错误
     */
    unknown() {
        return Object.assign({}, this.UNKNOWN)
    }
    /**
     * 未找到
     */
    notfound() {
        return Object.assign({}, this.NOTFOUND)
    }
    /**
     * 权限认证失败
     */
    unauthorized() {
        return Object.assign({}, this.UNAUTHORIZED)
    }
    /**
     * 内部服务器错误
     */
    serverError() {
        return Object.assign({}, this.SERVEREORROR)
    }
    /**
     * 没有相关数据
     */
    nodata() {
        return Object.assign({}, this.NODATA)
    }
    /**
     * 必填
     */
    required(value) {
        let _body = Object.assign({}, this.REQUIRED)
        _body.data = this.util.format(_body.data, value)
        return _body
    }
    /**
     * 已存在
     */
    found(value) {
        let _body = Object.assign({}, this.FOUND)
        _body.data = this.util.format(_body.data, value)
        return _body
    }
    /**
     * 字段无效
     */
    invalid(value) {
        let _body = Object.assign({}, this.INVALID)
        _body.data = this.util.format(_body.data, value)
        return _body
    }
    /**
     * 不匹配
     */
    unmatch(value1, value2) {
        let _body = Object.assign({}, this.MISMATCH)
        _body.data = this.util.format(_body.data, value1, value2)
        return _body
    }
    /**
     * 不存在
     */
    unexist(value) {
        let _body = Object.assign({}, this.UNEXIST)
        _body.data = this.util.format(_body.data, value)
        return _body
    }
    /**
     * 格式有误
     */
    wrongFormat(value) {
        let _body = Object.assign({}, this.WRONGFORMAT)
        _body.data = this.util.format(_body.data, value)
        return _body
    }
}

module.exports = new errorInfo()