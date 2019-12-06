/**
 * @description JSONP
 * @module JSONP
 * @author asanebou
 */

 /**
  * @description
  * @constructor JSONP
  * @param {request} opts
  * @returns {JSONP} xhr
  */
function JSONP(opts) {
    // server.php?callback=callbackFunction
    var callbackFunction = opts.jsonpCallbackFunction || generateCallbackFunction();
    var jsonpCallback = opts.jsonpCallback || 'callback'
    
    // 创建客户端script标签
    var xhr = document.createElement('script')
    if (xhr.charset) {
        xhr.charset = opts.charset
    }
    xhr.onerror = xhr[useOnload ? 'onload' : 'onreadystatechange'] = function (e) {
        var execute = /loaded|complete|undefined/i.test(xhr.readyState)
        if (e && e.type === 'error') {
            events['error'] && events['error']()
        } else if (execute) {
            setTimeout(function () {
                xhr.abort()
            }, 0)
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
        removeNode(xhr)
        clearFunction(callbackFunction)
    }

    /**
     * @description
     * @param {}
     * @param {String} url 服务端URL
     */
    xhr.open = function (a, url) {
        // 在window下添加callbackFunction，
        // script脚本执行后，服务端返回callbackFunction的调用，执行此方法。
        window[callbackFunction] = function (response) {
            events['load'] && events['load']({
                status: 200,
                statusText: 'ok',
                response: response
            })
            clearFunction(callbackFunction)
        }

        // 将script标签插入客户端head标签内
        // (画面加载时，会执行script脚本)
        var head = document.getElementsTagName('head')[0]
        // <script src="https://www.runoob.com/try/ajax/jsonp.php?jsoncallback=callbackFunction">
        url += (url.indexOf('?') === -1) ? '?' : '&';
        xhr.setAttribute('src', url + jsonpCallback + '=' + callbackFunction);
        head.insertBefore(xhr, head.firstChild)

        // 注册timeout事件
        if (typeof opts.timeout === 'number') {
            setTimeout(function () {
                events['timeout'] && events['timeout']()
                xhr.abort()
            }, opts.timeout)
        }
    }
}

// 默认callback函数
function generateCallbackFunction() {
    return ('jsonp' + Math.random()).replace(/0\./, '')
}

// Known issue: Will throw 'Uncaught ReferenceError: callback_*** is not defined' error if request timeout
function clearFunction(functionName) {
    // IE8 throws an exception when you try to delete a property on window
    // http://stackoverflow.com/a/1824228/751089
    try {
        delete window[functionName];
    } catch (e) {
        window[functionName] = undefined;
    }
}

var f = document.createDocumentFragment()
// TODO
var useOnload = 'textContent' in document
// TODO
function removeNode(node) {
    f.appendChild(node)
    f.removeChild(node)
    node.onload = onerror = onreadystatechange = function () {
    }
    return node
}

module.exports = JSONP