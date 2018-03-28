/**
 * 砍价商品表
 * @param {Object} knex 
 */
module.exports = (knex) => {
    knex.schema.hasTable('t_bargain').then(exists => {
        if (!exists) {
            return knex.schema.createTable('t_bargain', t => {
                t.uuid('id').unique().primary().notNullable()
                // 砍价金额得
                t.decimal('amount', 10, 2)
                // 砍价人数
                t.integer('count', 2)
                // 是否上架(0,1)
                t.integer('is_shelf').defaultTo(1)
                // 是否显示
                t.integer('active', 1).defaultTo(1)
                t.bigInteger('created_time').defaultTo(new Date().getTime())
                t.bigInteger('updated_time').defaultTo(new Date().getTime())

                // 商品id
                t.uuid('product_id').notNullable()
                t.foreign('product_id').references('id').inTable('t_product')

            })
        }
    })
}