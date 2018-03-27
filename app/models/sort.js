/**
 * 商品所属分类表
 * @param {Object} knex 
 */
module.exports = (knex) => {
    knex.schema.hasTable('t_sort').then(exists => {
        if (!exists) {
            return knex.schema.createTable('t_sort', t => {
                t.uuid('id').unique().primary().notNullable()
                // 名称
                t.string('name', 20)
                // 父级id
                t.uuid('parent_id')
                // 排序
                t.integer('sort')
                // 是否显示
                t.integer('active', 1).defaultTo(1)
                t.bigInteger('created_time').defaultTo(new Date().getTime())
                t.bigInteger('updated_time').defaultTo(new Date().getTime())
            })
        }
    })
}