/**
 * 拼单表
 * @param {Object} knex 
 */
module.exports = (knex) => {
    knex.schema.hasTable('t_fight').then(exists => {
        if (!exists) {
            return knex.schema.createTable('t_fight', t => {
                t.uuid('id').unique().primary().notNullable()
                // 父级id
                t.uuid('parent_id')
                // 是否显示
                t.integer('active', 1).defaultTo(1)
                t.bigInteger('created_time').defaultTo(new Date().getTime())
                t.bigInteger('updated_time').defaultTo(new Date().getTime())

                // 用户id
                t.uuid('user_id').notNullable()
                t.foreign('user_id').references('id').inTable('t_user')

                // 商品id
                t.uuid('product_id').notNullable()
                t.foreign('product_id').references('id').inTable('t_product')

            })
        }
    })
}