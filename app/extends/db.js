const config = require('../../config')

async function createDB() {
    // get the client
    const mysql = require('mysql2/promise')
    // create the connection
    const connection = await mysql.createConnection({
        host: config.db.connection.host,
        user: config.db.connection.user,
        password: config.db.connection.password
    })
    try {
        // create database
        await connection.execute('CREATE DATABASE IF NOT EXISTS ' + config.db.connection.database)
        const knex = require('knex')(config.db)
        require('../models')(knex)
        console.log('数据库初始化成功')
    }
    catch (e) {
        console.log(e)
    }
}


createDB()