/**
 * 用户表
 * @param {Object} knex 
 */
module.exports = (knex) => {
    knex.schema.hasTable('t_user').then(exists => {
        if (!exists) {
            return knex.schema.createTable('t_user', t => {
                t.uuid('id').unique().primary().notNullable()
                // 会员名
                t.string('name', 20)
                // 昵称
                t.string('nickname', 20)
                // 密码
                t.string('password', 32).notNullable()
                // 性别
                t.integer('gender', 1).defaultTo(3)
                // 头像
                t.string('avatar')
                // 手机号
                t.integer('tel', 11)
                // 邀请码
                t.string('code', 6)
                // 被邀请码
                t.string('coded', 6)
                // 微信小程序ID
                t.string('we_id', 18)
                // 微信小程序密钥
                t.string('we_secret', 32)
                // 支付宝小程序ID
                t.string('ant_id', 18)
                // 支付宝小程序密钥
                t.string('ant_secret', 32)
                // 是否显示
                t.integer('active', 1).defaultTo(1)
                t.bigInteger('created_time').defaultTo(new Date().getTime())
                t.bigInteger('updated_time').defaultTo(new Date().getTime())
            })
        }
    })
}