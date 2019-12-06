/**
 * @description HTTP报文-响应報文
 * @module Response
 * @author asanebou
 */

/**
* @requires module:Headers
* @requires module:Body
*/
var Headers = require('./Headers')
var Body = require('./Body')

/**
 * @description 响应報文
 * @constructor Response
 * @param {*} body 
 * @param {*} options 
 */
function Response(body, options) {
    if (!options) {
        options = {}
    }

    // 关联的 Headers 对象。
    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)

    // 响应类型
    // basic(同源响应)/cors/error/opaque
    this.type = 'default'
    // 状态码
    this.status = options.status
    if (1223 === this.status) {
        this.status = 204
    }
    // 状态码的可读性文本
    this.statusText = options.statusText
    // 一个布尔值，标示该 Response 成功
    this.ok = this.status >= 200 && this.status < 300
    // 响应的序列化（serialized）URL
    this.url = options.url || ''
    // 表示该 Response 是否来自一个重定向，如果是的话，它的 URL 列表将会有多个条目
    this.redirected = false
    // 标示这是否是该 Response 的最终 URL
    this.useFinalURL = true

    // 初始化主体
    this._initBody(body)
}

// 继承
var F = function () { }
F.prototype = Body.prototype
Response.prototype = new F()

/**
 * @description 创建一个 Response 对象的克隆
 * @returns {Response} response
 */
Response.prototype.clone = function () {
    return new Response(this._body, {
        status: this.status,
        statusText: this.statusText,
        headers: new Headers(this.headers),
        url: this.url
    })
}

/**
 * @description 返回一个绑定了网络错误的新的 Response 对象。
 * @returns {Response} response
 */
Response.prototype.error = function () {
    var response = new Response(null, { status: 0, statusText: '' })
    response.type = 'error'
    return response
}

// 重定向状态码
var redirectStatuses = [301, 302, 303, 307, 308]

/**
 * @@description 用另一个 URL 创建一个重定向的Response。
 * @param {string} url
 * @param {integer} status
 */
Response.prototype.redirect = function (url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
        throw new RangeError('Invalid status code')
    }

    return new Response(null, { status: status, headers: { location: url } })
}

/**
 * @exports Response
 */
module.exports = Response