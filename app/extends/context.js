'use strict'

const Store = require('./store')

module.exports = (app) => {
    app.context.redis = new Store()
}