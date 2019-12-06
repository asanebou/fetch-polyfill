/**
 * @description XMLHttpRequest的包装
 * @module XHR
 * @author asanebou
 */

/**
 * @constructor XHR
 * @param {Request} opts
 * @returns {XMLHttpRequest} xhr
 */
module.exports = function XHR(opts) {
    // IE7+、Firefox、Chrome、Safari、Opera
    var xhr = new XMLHttpRequest

    // 注册XMLHttpRequest的onload、onerror、ontimeout事件
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

    // 请求的证书
    if (opts.credentials === 'include') {
        // 一个布尔值，用来指定跨域 Access-Control 请求是否应带有授权信息
        xhr.withCredentials = true
    }

    if ('responseType' in xhr && ('Blob' in window)) {
        xhr.responseType = 'blob'
    }

    return xhr
}