/**
 * 优惠券表
 * @param {Object} knex 
 */
module.exports = (knex) => {
    knex.schema.hasTable('t_coupon').then(exists => {
        if (!exists) {
            return knex.schema.createTable('t_coupon', t => {
                t.uuid('id').unique().primary().notNullable()
                // 优惠金额
                t.decimal('amount', 10, 2)
                // 优惠金额
                t.decimal('coupon_amount', 10, 2)
                // 销售开始时间
                t.bigInteger('start_time')
                // 销售结束时间
                t.bigInteger('end_time')
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