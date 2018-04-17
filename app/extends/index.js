'use strict'

const os = require('os')

class Extend {
    constructor() {

    }
    getIps() {
        let ips = {}
        let ifaces = os.networkInterfaces()
        let name = ''
        for (const iface in ifaces) {
            name = iface
            break
        }
        let _arr = ifaces[name]
        for (let i = 0; i < _arr.length; i++) {
            const a = _arr[i]
            ips[a.family] = a.address

        }
        return ips
    }
}

module.exports = Extend