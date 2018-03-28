/**
 * 订单表
 * @param {Object} knex 
 */
module.exports = (knex) => {
    knex.schema.hasTable('t_order').then(exists => {
        if (!exists) {
            return knex.schema.createTable('t_order', t => {
                t.uuid('id').unique().primary().notNullable()
                // 订单编号
                t.string('order_no', 50)
                // 交易金额
                t.decimal('amount', 10, 2)
                // 订购数量
                t.integer('count')
                // 交易类型
                t.string('payment', 20)
                // 状态(1:待付款,2:待发货,3:待收货,4:待评价,5:退款/售后)
                t.integer('status', 1)
                // 收货人
                t.string('receiver', 10)
                // 联系电话
                t.string('telephone', 16)
                // 所在地区
                t.string('area', 100)
                // 详细地址
                t.string('address', 100)
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