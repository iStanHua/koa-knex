/**
 * 评价表
 * @param {Object} knex 
 */
module.exports = (knex) => {
    knex.schema.hasTable('t_comment').then(exists => {
        if (!exists) {
            return knex.schema.createTable('t_comment', t => {
                t.uuid('id').unique().primary().notNullable()
                // 评语
                t.text('content')
                // 商品描述分值
                t.integer('desc_score', 1)
                // 商家服务分值
                t.integer('service_score', 1)
                // 物流服务分值
                t.integer('express_score', 1)
                // 是否显示
                t.integer('active', 1).defaultTo(1)
                t.bigInteger('created_time').defaultTo(new Date().getTime())
                t.bigInteger('updated_time').defaultTo(new Date().getTime())

                // 用户id
                t.uuid('user_id').notNullable()
                t.foreign('user_id').references('id').inTable('t_user')

                // 订单id
                t.uuid('order_id').notNullable()
                t.foreign('order_id').references('id').inTable('t_order')

            })
        }
    })
}