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
                t.decimal('price', 10, 2)
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
                // 状态(0,1)
                t.integer('active',1).defaultTo(1)
                t.bigInteger('created_time').defaultTo(new Date().getTime())
                t.bigInteger('updated_time').defaultTo(new Date().getTime())

                // 分类id
                t.uuid('sort_id').notNullable()
                t.foreign('sort_id').references('id').inTable('t_sort')

            })
        }
    })
}