'use strict'

const Knex = require('knex')
const config = require('../../config')

class Service {
    constructor(table) {
        this.table = table
        this.knex = Knex(config.db)
        this.errorInfo = require('../extends/errorInfo')
    }
    /**
     * 执行sql语句
     * @param {String} sql     sql语句
     * @param {Object} values  值
     * @returns result
     */
    async query(sql, values = {}) {
        return await this.knex.raw(sql, values)
    }
    /**
     * 新增
     * @param {Object} values  值
     */
    async insert(values = {}) {
        let dt = new Date().getTime()
        if (!values.created_time) {
            values.created_time = dt
        }
        if (!values.updated_time) {
            values.updated_time = dt
        }
        return await this.knex(this.table).returning(['id']).insert(values)
    }
    /**
     * 批量新增
     * @param {Array}  records  从中创建实例的对象列表（键/值对）
     * @returns result
     */
    async batchInsert(records = []) {
        return await this.knex(this.table).insert(records)
    }
    /**
     * 新增或修改
     * @param {Object} values  值
     * @param {Object} where   where值
     */
    async insertOrUpdate(values = {}, where = {}) {
        let result = await this.count({ where: where })
        if (result[0].count) {
            return await this.update(values, where)
        }
        else {
            let dt = new Date().getTime()
            if (!values.created_time) {
                values.created_time = dt
            }
            if (!values.updated_time) {
                values.updated_time = dt
            }
            return await this.insert(values)
        }
    }
    /**
     * 修改
     * @param {Object} values  值
     * @param {Object} where   where值
     */
    async update(values = {}, where = {}) {
        if (!values.updated_time) {
            values.updated_time = new Date().getTime()
        }
        return await this.knex(this.table).update(values, { where: where })
    }
    /**
     * 删除
     * @param {Object} where   where值
     */
    async delete(where = {}) {
        return await this.knex(this.table).del({ where: where })
    }
    /**
     * 获取或新增
     * @param {Object} where    查询条件 
     * @param {Object} defaults 默认值 
     * @returns result 
     */
    async getOrInsert(where = {}, defaults = {}) {
        let result = await this.get({ where: where })
        if (!result) {
            let dt = new Date().getTime()
            if (!defaults.created_time) {
                defaults.created_time = dt
            }
            if (!defaults.updated_time) {
                defaults.updated_time = dt
            }
            result = await this.insert(defaults)
        }
        return result
    }
    /**
     * 查询一条记录
     * @param {Object} where    参数(where)
     * @param {Array}  columns  字段
     * @returns result
     */
    async get(where = {}, columns = ['*']) {
        return await this.knex(this.table).where(where).first(columns)
    }
    /**
     * 查询多条记录
     * @param {Object} options 参数(where)
     * @returns result
     */
    async select(options = {}) {
        if (options.page_index && isNaN(Number(options.page_index))) {
            return this.success(ctx, this.errorInfo.invalid('页码'))
        }
        if (options.page_size && isNaN(Number(options.page_size))) {
            return this.success(ctx, this.errorInfo.invalid('每页显示记录数'))
        }
        let data = {
            where: {
                active: '1'
            },
            order: [['created_time', 'DESC']]
        }
        let _options = Object.assign(data, options)
        let sum = await this.knex(this.table).where(_options.where).count('id as count')
        let kx = this.knex(this.table).where(_options.where)
        kx = this._orderBy(kx, _options.order)
        if (_options.page_index || _options.page_size) {
            _options.page_index = Number(_options.page_index) || 1
            _options.page_size = Number(_options.page_size) || 10
            kx = kx.limit(_options.page_size).offset((_options.page_index - 1) * _options.page_size)
        }
        let rows = await kx
        return { count: sum[0].count, rows }
    }
    /**
     * 查询多条记录
     * @param {Object} options       参数(where,order)
     * @param {Object} options.where where
     * @param {Array}  options.order order
     * @returns result
     */
    async findAll(options = {}) {
        let kx = this.knex(this.table).where(options.where)
        kx = this._orderBy(kx, options.order)
        return await kx
    }
    /**
     * 记录数
     * @param {String} table          模块名
     * @param {Object} where          where值
     * @param {String|Object} field   字段
     * @returns result
     */
    async count(where = {}, field = 'id as count') {
        return await this.knex(this.table).where(where).count(field)
    }
    /**
    * 总和
    * @param {String} field   字段(column|columns|raw)
    * @returns result 
    */
    async sum(field, options = {}) {
        return await this.knex(this.table).sum(field)
    }
    /**
     * 最大值
     * @param {String|Object} field  字段(column|columns|raw)
     * @returns result 
     */
    async max(field, options = {}) {
        return await this.knex(this.table).max(field)
    }
    /**
     * 最小值
     * @param {String|Object} field  字段(column|columns|raw)
     * @returns result 
     */
    async min(field) {
        return await this.knex(this.table).min(field)
    }
    /**
     * 平均值
     * @param {String|Object} field  字段(column|columns|raw)
     * @returns result 
     */
    async avg(field) {
        return await this.knex(this.table).avg(field)
    }
    /**
     * 
     * @param {Object} kx   knex对象
     * @param {Array} order [['sort', 'ASC']]
     * @returns knex对象
     */
    _orderBy(kx, order) {
        if (Array.isArray(order)) {
            order.forEach(o => {
                kx.orderBy(o[0], o[1].toString().toLowerCase())
            })
        }
        return kx
    }
}

module.exports = Service