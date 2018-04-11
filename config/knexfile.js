'use strict'

module.exports = {
    development: {
        client: 'mysql',
        connection: {
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: '123456',
            database: 'koa_che'
        },
        debug: true
    },
    production: {
        client: 'mysql',
        connection: {
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: '123456',
            database: 'koa_che'
        }
    }
}