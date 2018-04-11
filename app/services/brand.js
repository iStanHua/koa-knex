'use strict'

const Service = require('./index')

class BrandService extends Service {
    constructor() {
        super('t_brand')
    }

    /**
     * 新增品牌
     * @param {Object} data 品牌数据
     * @returns result
     */
    async addBrand(data) {
        if (data.name) {
            let res = await this.count({ name: data.name })
            if (res) {
                return this.errorInfo.found('该品牌名')
            }
        }
        return await this.insert(data)
    }
    /**
     * 修改品牌
     * @param {Number} id 
     * @param {Object} data 
     */
    async updateBrand(id, data) {
        let res = await this.count({ id: id })
        if (!res) {
            return this.errorInfo.unexist('该品牌')
        }
        return await this.update(data, { id: id })
    }
    /**
    * 删除品牌
    * @param {Number} id     品牌编号
    * @param {Boolean} flag  是否真删
    * @returns result
    */
    async deleteBrand(id, flag = false) {
        let res = await this.count({ id: id })
        if (!res) {
            return this.errorInfo.unexist('该品牌')
        }
        if (flag) {
            return await this.delete({ id: id })
        }
        else {
            return await this.updateBrand(id, { active: '0' })
        }
    }
    /**
     * 品牌详情
     * @param {Number} id 
     */
    async brandDetail(id) {
        let res = await this.count({ id: id })
        if (!res) {
            return this.errorInfo.unexist('该品牌')
        }
        return await this.get({
            where: {
                id: id,
                active: '1'
            }
        })
    }
    /**
     * 品牌列表
     * @param {String} data.name       名称
     * @param {Number} data.page_index 页码索引
     * @param {Number} data.page_size  每页显示记录数
     */
    async brandList(data) {
        let options = {
            where: {
                active: '1'
            },
            order: [['sort', 'ASC']]
        }
        data.page_index && (options.page_index = data.page_index)
        data.page_size && (options.page_size = data.page_size)
        data.name && (options.where.name = { [this.Op.like]: '%' + data.name + '%' })
        return await this.select(options)
    }
    /**
     * 全部品牌
     */
    async brandAll() {
        return await this.findAll({
            where: {
                active: '1'
            },
            order: [['sort', 'ASC']]
        })
    }
}

module.exports = new BrandService()