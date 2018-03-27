/**
 * 订单表
 * @param {Object} knex 
 */
module.exports = (knex) => {
    knex.schema.hasTable('t_order').then(exists => {
        if (!exists) {
            return knex.schema.createTable('t_order', t => {
                t.uuid('id').unique().primary().notNullable()
                // 生成订单的编号
                t.string('order_no', 50)

                // 付款方式
                t.string('payment', 20)
                // 付款方式
                t.string('price', 20)
                // 订购数量
                t.integer('count')
                // 状态(1:待付款,2:待发货,3:待收货,4:待评价,5:退款/售后)
                t.integer('status', 1)
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