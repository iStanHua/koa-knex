/**
 * 商家表
 * @param {Object} knex 
 */
module.exports = (knex) => {
    knex.schema.hasTable('t_business').then(exists => {
        if (!exists) {
            return knex.schema.createTable('t_business', t => {
                t.uuid('id').unique().primary().notNullable()
                // 商户名
                t.string('name', 20)
                // 企业名称
                t.string('company_name', 50)
                // 公司地址
                t.string('company_address')
                // 法定代表人
                t.string('legal_person', 30)
                // 身份证
                t.string('card', 18)
                // 身份证正面图片
                t.string('card_image1')
                // 身份证反面图片
                t.string('card_image2')
                // 营业执照号
                t.integer('business_no', 20)
                // 营业执照图片
                t.string('business_image')
                // 纳税人识别码
                t.integer('tax_no', 20)
                // 纳税人识别码图片
                t.string('tax_image')
                // 品牌名
                t.string('brand_name', 20)
                // 密码
                t.string('password', 32).notNullable()
                // 头像
                t.string('avatar')
                // 手机号
                t.integer('tel', 11)
                // 保证金
                t.decimal('security_deposit', 8, 2)
                // 推广码
                t.string('code', 6)
                // 店铺类型(1:旗舰店,2:专卖店,3:专营店)
                t.integer('type', 1)
                // 商标状态(1:R标,2:TM标)
                t.integer('trademark', 1)
                // 商品类目(多个用,分割)
                t.string('category', 100)
                // 是否显示
                t.integer('active', 1).defaultTo(1)
                t.bigInteger('created_time').defaultTo(new Date().getTime())
                t.bigInteger('updated_time').defaultTo(new Date().getTime())
            })
        }
    })
}