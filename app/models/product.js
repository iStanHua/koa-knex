/**
 * 商品表
 * @param {Object} knex 
 */
module.exports = (knex) => {
    knex.schema.hasTable('t_product').then(exists => {
        if (!exists) {
            return knex.schema.createTable('t_product', t => {
                t.uuid('id').unique().primary().notNullable()
                // 名称
                t.string('name', 100)
                // 销售单价
                t.decimal('sale_amount', 10, 2)
                // 市场单价
                t.decimal('market_amount', 10, 2)
                // 运费
                t.decimal('express_amount', 10, 2).defaultTo(0)
                // 销售数量
                t.integer('sale_count')
                // 图片（多张用,分割）
                t.string('image', 480)
                // 销售开始时间
                t.bigInteger('start_time')
                // 销售结束时间
                t.bigInteger('end_time')
                // 排序
                t.integer('sort')
                // 是否上架(0,1)
                t.integer('is_shelf').defaultTo(0)
                // 详情
                t.text('content')
                // 是否支持拼单(0,1)
                t.integer('is_fight').defaultTo(0)
                // 拼单金额
                t.decimal('fight_amount', 10, 2)
                // 拼单人数
                t.integer('fight_count', 1)
                // 状态(0,1)
                t.integer('active', 1).defaultTo(1)
                t.bigInteger('created_time').defaultTo(new Date().getTime())
                t.bigInteger('updated_time').defaultTo(new Date().getTime())

                // 分类id
                t.uuid('sort_id').notNullable()
                t.foreign('sort_id').references('id').inTable('t_sort')

                // 商家id
                t.uuid('business_id').notNullable()
                t.foreign('business_id').references('id').inTable('t_business')
            })
        }
    })
}