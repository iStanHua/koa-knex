/**
 * 地址表
 * @param {Object} knex 
 */
module.exports = (knex) => {
    knex.schema.hasTable('t_address').then(exists => {
        if (!exists) {
            return knex.schema.createTable('t_address', t => {
                t.uuid('id').unique().primary().notNullable()
                // 收货人
                t.string('receiver', 10)
                // 联系电话
                t.string('telephone', 16)
                // 所在地区
                t.string('area', 100)
                // 详细地址
                t.string('address', 100)
                // 默认
                t.integer('is_default',1).defaultTo(1)
                // 是否显示
                t.integer('active',1).defaultTo(1)
                t.bigInteger('created_time').defaultTo(new Date().getTime())
                t.bigInteger('updated_time').defaultTo(new Date().getTime())

                // 用户id
                t.uuid('user_id').notNullable()
                t.foreign('user_id').references('id').inTable('t_user')
            })
        }
    })
}