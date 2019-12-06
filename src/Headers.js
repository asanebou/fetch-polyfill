/**
 * @description HTTP报文的首部对象
 * @module Headers
 * @author asanebou
 */

/**
 * @requires module:support
 */
var support = require('./support')

/**
 * @description 创建一个HTTP报文的首部对象
 * @constructor Headers
 * @param {object} init 包含HTTP报文首部的名值对的对象
 */
function Headers(init) {
    /**
     * @description {name:list}
     * @private
     */
    this.map = {}

    if (init instanceof Headers) {
        init.forEach(function (value, name) {
            this.append(name, value)
        }, this)

    } else if (init) {
        for (var name in init) {
            if (init.hasOwnProperty(name)) {
                this.append(name, init[name])
            }
        }
    }
}

/**
 * @description 给现有的header添加一个值, 或者添加一个未存在的header并赋值
 * @param {string} name header名
 * @param {string} value header值
 */
Headers.prototype.append = function (name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var list = this.map[name]
    if (!list) {
        list = []
        this.map[name] = list
    }
    list.push(value)
}

/**
 * @description 从Headers对象中删除指定header.
 * @param {string} name header名
 */
Headers.prototype.delete = function (name) {
    delete this.map[normalizeName(name)]
}

/**
 * @description 从Headers对象中检索的header名,如果不存在则会返回null，如果存在则返回header值中的第一个。
 * @param {string} name header名
 * @returns {string} header值
 */
Headers.prototype.get = function (name) {
    var values = this.map[normalizeName(name)]
    return values ? values[0] : null
}

/**
 * @description 用于返回具有给定header名称的所有header值的数组
 * @param {string} name header名
 * @returns {[]} header值
 */
Headers.prototype.getAll = function (name) {
    return this.map[normalizeName(name)] || []
}

/**
 * @description 以布尔值的形式从Headers对象中返回是否存在指定的header
 * @param {string} name header名
 * @returns {boolean} true：执行的header名存在；false：指定的header名不存在
 */
Headers.prototype.has = function (name) {
    return this.map.hasOwnProperty(normalizeName(name))
}

/**
 * @description 替换现有的header的值, 或者添加一个未存在的header并赋值
 * @param {string} name header名
 */
Headers.prototype.set = function (name, value) {
    this.map[normalizeName(name)] = [normalizeValue(value)]
}

/**
 * @description 对每个header的值调用回调函数
 * @param {fn} callback 回调函数
 * @param {object} thisArg 回调函数的执行上下文
 */
Headers.prototype.forEach = function (callback, thisArg) {
    for (var name in this.map) {
        if (this.map.hasOwnProperty(name)) {
            this.map[name].forEach(function (value) {
                callback.call(thisArg, value, name)
            }, this)
        }
    }
}

/**
 * @description 以迭代器的形式返回Headers对象中所有存在的header名.
 * @returns {iterator} header名的迭代器
 */
Headers.prototype.keys = function () {
    var items = []
    this.forEach(function (value, name) {
        items.push(name)
    })
    return iteratorFor(items)
}

/**
 * @description 以迭代器的形式返回Headers对象中所有存在的header的值.
 * @returns {iterator} header值的迭代器
 */
Headers.prototype.values = function () {
    var items = []
    this.forEach(function (value) {
        items.push(value)
    })
    return iteratorFor(items)
}

/**
 * @description 以迭代器的形式返回Headers对象中所有的名值对.
 * @returns {iterator} header名值对的迭代器
 */
Headers.prototype.entries = function () {
    var items = []
    this.forEach(function (value, name) {
        items.push([name, value])
    })
    return iteratorFor(items)
}

if (support.iterable) {
    /**
     * @description Header的迭代器
    */
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
}

/**
 * @description header名的格式化
 * @param {*} name header名
 * @returns 格式化后的header名
 * @private
 */
function normalizeName(name) {
    if (typeof name !== 'string') {
        name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
        throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
}

/**
 * @description header值的字符串化
 * @param {*} name header值
 * @returns 字符串化后的header值
 * @private
 */
function normalizeValue(value) {
    if (typeof value !== 'string') {
        value = String(value)
    }
    return value
}

/**
 * @description 把數組iterator化
 * @param {[]} arr 
 * @returns {iterator}
 * @private
 */
function iteratorFor(arr) {
    return arr[Symbol.iterator]();
}

/**
 * @exports Headers
 */
module.exports = Headers