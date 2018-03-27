
'use strict'

const Knex = require('knex')
const config = require('../../config')

module.exports = async (ctx, next) => {
    let knex = Knex(config.db)
    ctx.db = knex
    await next()
}