/**
 * @description XMLHttpRequest/ActiveXObject/XDomainRequest/JSONP的包装对象
 * @module Transport
 * @author asanebou
 */

/**
 * @requires module:axo
 * @requires module:jsonp
 * @requires module:xdr
 * @requires module:xhr
 */
var AXO = require('./transports/axo')
var JSONP = require('./transports/jsonp')
var XDR = require('./transports/xdr')
var XHR = require('./transports/xhr')

// ie version
var msie = 0
if (window.VBArray) {
    msie = document.documentMode || (window.XMLHttpRequest ? 7 : 6)
}

/**
 * @description XMLHttpRequest/ActiveXObject/XDomainRequest/JSONP的包装对象
 * @constructor Transport
 * @param {Request} request
 */
function Transport(request) {
    if (msie === 8 || msie === 9) {
        // XDomainRequest
        this.core = new XDR(request)
    } else if (!msie) {
        // XMLHttpRequest
        this.core = new XHR(request)
    } else if (msie <= 7) {
        if (request.credentials === 'include') {
            // JSONP
            this.core = new JSONP(request)
        } else {
            // ActiveXObject
            this.core = new AXO(request)
        }
    }
}

/**
* @description 注册指定类型的事件
* @param {String} type 事件类型：load,error,timeout
* @param {function} fn 回调函数
*/
Transport.prototype.on = function (type, fn) {
    this.core.on(type, fn)
}

/**
 * @description 初始化 HTTP 请求参数，但是并不发送请求。
 * @param {string} method
 * @param {string} url
 * @param {string} async
 * @param {string} user
 * @param {string} password
 */
Transport.prototype.open = function (method, url, async, user, password) {
    if (this.core.open) {
        this.core.open(method, url, async, user, password)
    }
}

/**
 * @description 向一个打开但未发送的请求设置或添加一个 HTTP 请求。
 * @param {string} name 属性名 
 * @param {string} value 属性值
 */
Transport.prototype.setRequestHeader = function (name, value) {
    if (this.core.setRequestHeader) {
        this.core.setRequestHeader(name, value)
    }
}

/**
 * @description 发送 HTTP 请求，使用传递给 open() 方法的参数，以及传递给该方法的可选请求体。
 * @param {ArrayBuffer/ArrayBufferView/Blob/Document/DOMString?/FormData} data
 */
Transport.prototype.send = function (data) {
    if (this.core.send) {
        this.core.send(data)
    }
}

/**
 * @description 取消当前响应，关闭连接并且结束任何未决的网络活动。
 */
Transport.prototype.abort = function () {
    if (this.core.abort) {
        this.core.abort()
    }
}

/**
 * @exports Transport
 */
module.exports = Transport