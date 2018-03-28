/**
 * 砍价记录表
 * @param {Object} knex 
 */
module.exports = (knex) => {
    knex.schema.hasTable('t_bargain_record').then(exists => {
        if (!exists) {
            return knex.schema.createTable('t_bargain_record', t => {
                t.uuid('id').unique().primary().notNullable()
                // 父级id
                t.uuid('parent_id')
                // 砍价金额
                t.decimal('amount', 10, 2)
                // 是否显示
                t.integer('active', 1).defaultTo(1)
                t.bigInteger('created_time').defaultTo(new Date().getTime())
                t.bigInteger('updated_time').defaultTo(new Date().getTime())

                // 用户id
                t.uuid('user_id').notNullable()
                t.foreign('user_id').references('id').inTable('t_user')

                // 砍价id
                t.uuid('bargain_id').notNullable()
                t.foreign('bargain_id').references('id').inTable('t_bargain')
            })
        }
    })
}