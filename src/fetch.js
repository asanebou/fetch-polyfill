/**
 * @description HTTP报文的首部对象
 * @module fetch
 * @author asanebou
 */

/**
 * @requires module:Request
 * @requires module:Response
 * @requires module:Headers
 * @requires module:Transport
 */
var Request = require('./Request')
var Response = require('./Response')
var Headers = require('./Headers')
var Transport = require('./Transport')

/**
 * @description array添加foreach方法
 * @param {fn} fn 回调函数
 * @param {this} scope 执行上下文
 * @private
 */
if (![].forEach) {
    Array.prototype.forEach = function (fn, scope) {
        'use strict'
        var i, len
        for (i = 0, len = this.length; i < len; ++i) {
            if (i in this) {
                fn.call(scope, this[i], i, this)
            }
        }
    }
}

/**
 * @description string添加trim方法
 * @returns {string}
 * @private
 */
if (!'asanebou'.trim) {
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
    String.prototype.trim = function () {
        return this.replace(rtrim, '')
    }
}

/**
 * @description 根据xhr的首部，生成Headers对象
 * @param {*} xhr XMLHttpRequest/ActiveXObject/XDomainRequest/自定义对象
 * @returns {Headers} head
 * @private
 */
function headers(xhr) {
    var head = new Headers()

    if (xhr.getAllResponseHeaders) {
        var headerStr = xhr.getAllResponseHeaders() || ''
        if (/\S/.test(headerStr)) {
            // CRLF
            var headerPairs = headerStr.split('\u000d\u000a');
            for (var i = 0; i < headerPairs.length; i++) {
                var headerPair = headerPairs[i];
                // Can't use split() here because it does the wrong thing
                // if the header value has the string ": " in it.
                var index = headerPair.indexOf('\u003a\u0020')
                if (index > 0) {
                    var key = headerPair.substring(0, index).trim()
                    var value = headerPair.substring(index + 2).trim()
                    head.append(key, value)
                }
            }
        }
    }
    return head
}

/**
 * @description fetch
 * @param {String/Requst} input URL或者Request对象
 * @param {Request/undefined} init 可选对象，包含请求中的自定义属性
 * @return {Promise} promise
 */
function fetch(input, init) {
    return new Promise(function (resolve, reject) {
        var request

        // 初始化Request
        if (!init && input instanceof Request) {
            request = input
        } else {
            request = new Request(input, init)
        }

        var xhr = new Transport(request)

        // TODO xhr没实现
        /**
         * @description 获取响应的URL
         * @returns {string} url
         * @private
         */
        function responseURL() {
            if ('responseURL' in xhr) {
                return xhr.responseURL
            }
            // Avoid security warnings on getResponseHeader when not allowed by CORS
            if (xhr.getResponseHeader && /^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
                return xhr.getResponseHeader('X-Request-URL')
            }

            return
        }

        /**
         * @description 注册onload事件,请求成功完成时触发.
         * @param {string} load 事件类型
         * @param {fn} callback 回调函数
         */
        xhr.on('load', function (event) {
            // event XMLHttpRequest/ActiveXObject/XDomainRequest/自定义对象

            var options = {
                // 响应状态
                status: event.status,
                // 响应状态文本
                statusText: event.statusText,
                // 响应首部
                headers: headers(event),
                // 响应URL
                url: responseURL()
            }

            // 获得主体
            // arraybuffer blob document json text moz-chunked-arraybuffer ms-stream : string
            var body = 'response' in event ? event.response : event.responseText

            // 更新promise的状态为成功，参数是Response
            resolve(new Response(body, options))
        })

        /**
         * @description 注册onerror事件，当request遭遇错误时触发。
         * @param {string} load 事件类型
         * @param {fn} callback 回调函数
         */
        xhr.on('error', function () {
            reject(new TypeError('Network request failed'))
        })

        /**
         * @description 注册ontimeout事件,在预设时间内没有接收到响应时触发。
         * @param {string} load 件类型
         * @param {fn} callback 回调函数
         */
        xhr.on('timeout', function () {
            reject(new TypeError('Network request timeout'))
        })

        // 初始化
        xhr.open(request.method, request.url, true)

        // 设置请求报文首部
        request.headers.forEach(function (value, name) {
            // 调用XMLHttpRequest/ActiveXObject/XDomainRequest的setRequestHeader
            xhr.setRequestHeader(name, value)
        })

        // 发出请求
        xhr.send(typeof request._body === 'undefined' ? null : request._body)
    })
}

/**
 * @exports fetch
 */
module.exports = fetch