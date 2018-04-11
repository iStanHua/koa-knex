'use strict'

const crypto = require('crypto')

class Secret {
    constructor() {

    }

    /**
     * 加密
     * @param {String|Buffer} data 数据         
     * @param {String}        algorithm   算法  ['md5', 'sha1', 'sha224', 'sha256', 'sha384', 'sha512']
     * @param {String|Buffer} key  密钥
     */
    Encrypt(data, algorithm, key) {
        let c = null
        if (key) {
            c = crypto.createHmac(algorithm, key)
        } else {
            c = crypto.createHash(algorithm)
        }
        c.update(data)
        return c.digest('hex')
    }
    /**
     * 签名
     * @param {String|Buffer} data 数据         
     * @param {String|Buffer} key  密钥
     */
    Sign(data, key) {
        return data + '.' + this.Encrypt(data, 'sha256', key)
    }
    /**
     * 反向签名
     * @param {String|Buffer} data 数据         
     * @param {String|Buffer} key  密钥
     */
    Unsign(data, key) {
        let temp = data.slice(0, data.lastIndexOf('.'))
        let mac = this.Sign(temp, key)
        return mac == data ? temp : false
    }
    /**
     * ASE加密
     * @param {String|Buffer} data 数据         
     * @param {String|Buffer} key  密钥
     */
    ASE_Encrypt(data, key) {
        let cipher = crypto.createCipheriv('aes-128-ecb', key, Buffer.alloc(0))
        return cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
    }
    /**
     * ASE解密
     * @param {String|Buffer} data 数据         
     * @param {String|Buffer} key  密钥
     */
    ASE_Decrypt(data, key) {
        let cipher = crypto.createDecipheriv('aes-128-ecb', key, Buffer.alloc(0))
        return cipher.update(data, 'hex', 'utf8') + cipher.final('utf8')
    }

    /**
     * 创建token
     * @param {String|Buffer} publicKey   公钥         
     * @param {String|Buffer} privateKey  私钥      
     * @param {String|Buffer} ts          
     */
    createToken(publicKey, privateKey, ts) {
        return this.Encrypt(`${publicKey}:${privateKey}:${ts}`, 'sha1')
    }

    /**
     * 验证token
     * @param {String|Buffer} publicKey   公钥         
     * @param {String|Buffer} privateKey  私钥      
     * @param {String|Buffer} ts             
     * @param {String|Buffer} signOrigin  token       
     */
    validToken(publicKey, privateKey, ts, signOrigin) {
        let sign = this.CreateToken(publicKey, privateKey, ts)
        return (sign === signOrigin)
    }
}

module.exports = new Secret()