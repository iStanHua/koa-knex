'use strict'

class fetch {
    constructor() {
        this.request = require('request')
    }
    /**
     * 
     * @param {String}  url      请求地址
     * @param {Object}  options  参数
     */
    get(url, options = {}) {
        return new Promise((resolve, reject) => {
            request
                .get(url, options)
                .on('response', function (response) {
                    console.log(response)
                    if (response.statusCode) {
                        resolve(response)
                    }
                })
                .on('error', function (err) {
                    reject({ code: 404, data: res.message })
                })
        })
    }

    /**
     * 
     * @param {String}  url    请求地址
     * @param {Object}  data   请求数据
     */
    post(url, data) {
        return new Promise((resolve, reject) => {
            let _options = {
                method: 'POST',
                url: url,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }
            request(_options)
                .then((err, res) => {
                    let _data = res.data
                    if (res.status == 200) {
                        resolve(_data)
                    }
                    else {
                        reject({ code: res.status, data: res.message })
                    }
                })
                .catch(res => {
                    reject({ code: 404, data: res.message })
                })
        })
    }

}

module.exports = new fetch()