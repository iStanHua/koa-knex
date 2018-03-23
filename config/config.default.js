'use strict'

module.exports = {
  client: 'mysql',
  connection: {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '123456',
    database: 'mysql_knex'
  },
  pool: { min: 2, max: 10 }
}