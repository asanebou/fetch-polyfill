/**
 * @description XDomainRequest
 * @module XDR
 * @author asanebou
 */

/**
 * @description
 * @constructor XDR
 * @param {Request} opts
 * @returns {XDomainRequest} xdr
 */
module.exports = function XDR(opts) {
    // 跨域请求
    var xhr = new XDomainRequest()

    // 注册XDomainRequest的onload、onerror、ontimeout事件
    // onload=>events[load]
    // onerror=>events[error]
    // ontimeout=>events[timeout]
    'load,error,timeout'.replace(/\w+/g, function (method) {
        xhr['on' + method] = function () {
            if (events[method]) {
                events[method](xhr)
            }
        }
    })

    /**
     * @description 已注册事件集[type:callback]
     * @private 
     */
    var events = {}

    /**
     * @description 注册指定类型的事件
     * @param {String} type 事件类型：load,error,timeout
     * @param {function} fn 回调函数
     */
    xhr.on = function (type, fn) {
        events[type] = fn
    }

    /**
     * @description 取消所有的已注册事件
     */
    xhr.onabort = function () {
        events = {}
    }

    // 设置ontimeout事件触发时间
    if (typeof opts.timeout === 'number') {
        xhr.timeout = opts.timeout
    }

    return xhr
}