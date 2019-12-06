/**
 * @description HTTP报文-請求報文
 * @module Request
 * @author asanebou
 */

/**
* @requires module:Headers
* @requires module:Body
*/
var Headers = require('./Headers')
var Body = require('./Body')

/**
 * @description HTTP请求报文
 * @constructor Request
 * @param {String/Request} input URl或者Request对象
 * @param {object/undefined} options 可选对象，包含请求中的自定义属性{method，headers，body，mode，credentials，cache，redirect，referrerintegrity}、
 */
function Request(input, options) {
    options = options || {}

    // 参数是Request的场合
    if (input instanceof Request) {
        // 主体已经被用于一个响应中，抛出Error
        if (input.bodyUsed) {
            throw new TypeError('Already read')
        }

        // 请求相关的Headers对象
        if (!options.headers) {
            var h = this.headers = new Headers(input.headers)
            if (!h.map['x-requested-with']) {
                h.set('X-Requested-With', 'XMLHttpRequest')
            }
        }

        // 请求的方法
        this.method = input.method
        // 请求的资源URL
        this.url = input.url
        // 请求的模式,
        this.mode = input.mode
        // 请求的证书
        this.credentials = input.credentials
        // body
        if (!options.body) {
            // 请求的主体
            body = input._body
            // 存储一个Boolean判断主体是否已经被用于一个响应中.
            input.bodyUsed = true
        }
    } else {
        // 请求的资源URL
        this.url = input
    }

    // 请求的方法
    this.method = (options.method || this.method || 'GET').toUpperCase()
    // 请求的模式
    // cors/no-cors/same-origin/navigate
    this.mode = options.mode || this.mode || null
    // 请求的证书
    // omit/same-origin/include
    this.credentials = options.credentials || this.credentials || 'omit'
    // 请求相关的Headers对象
    if (options.headers || !this.headers) {
        this.headers = new Headers(options.headers)
    }

    // 请求的来源
    // client/no-referrer/{URL}
    this.referrer = null
    // 请求来源的策略
    this.referrerPolicy = null
    // 重定向模式
    // follow/error/manual
    this.redirect = null
    // 请求的子资源的完整性值
    this.integrity = null
    // 请求的缓存模式，它控制着请求以何种方式与浏览器的HTTP缓存进行交互。
    // default/no-store/reload/no-cache/force-cache/only-if-cached
    this.cache = null

    if ((this.method === 'GET' || this.method === 'HEAD') && options.body) {
        throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(options.body)
}

/**
 * @description 创建当前request的副本
 * @return {Request} request
 */
Request.prototype.clone = function () {
    return new Request(this)
}

// 继承
var F = function () { }
F.prototype = Body.prototype
Request.prototype = new F()

/**
 * @exports Request
 */
module.exports = Request