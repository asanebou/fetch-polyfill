/**
 * @description ActiveXObject的包装
 * @module AXO
 * @author asanebou
 */

/**
 * @constructor AXO
 * @param {request} opts
 * @returns {ActiveXObject} AXO
 */
module.exports = function AXO(opts) {
    // IE7-
    var xhr = new ActiveXObject('Microsoft.XMLHTTP')

    // 执行onload、onerror事件
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (/^2\d\d|1224/.test(xhr.status)) {
                events['load'] && events['load'](xhr)
            } else {
                events['error'] && events['error']()
            }
        }
    }

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
    xhr.abort = function () {
        events = {}
    }

    // 设置timeout事件执行时间
    if (typeof opts.timeout === 'number') {
        setTimeout(function () {
            events['timeout'] && events['timeout']()
            xhr.abort()
        }, opts.timeout)
    }

    return xhr
}