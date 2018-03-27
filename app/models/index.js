
'use strict'
// const fs = require('fs')
// const path = require('path')
// const basename = path.basename(module.filename)

module.exports = (knex) => {
    // fs.readdirSync(__dirname)
    //     .filter((file) => {
    //         return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
    //     })
    //     .forEach((file) => {
    //         require('./' + file)(knex)
    //     })

    require('./sort')(knex)
    require('./user')(knex)
    require('./address')(knex)
    require('./product')(knex)
    require('./order')(knex)
}
