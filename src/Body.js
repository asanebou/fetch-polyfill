/**
 * @description HTTP报文-主体
 * @module Body
 * @author asanebou
 */

/**
* @requires module:support
*/
var support = require('./support')

/**
 * @description 主体
 * @constructor Body
 */
function Body() {
    // 存储一个Boolean判断主体是否已经被用于一个响应中.
    this.bodyUsed = false
}

/**
 * @description 注册text,blob,formData,json,arrayBuffer事件
 */
'text,blob,formData,json,arrayBuffer'.replace(/\w+/g, function (method) {
    Body.prototype[method] = function () {
        return consumeBody(this).then(function (body) {
            return convertBody(body, method)
        })
    }
})

/**
 * @description
 * @param {*} body text blob formData searchParams json
 */
Body.prototype._initBody = function (body) {
    this._body = body
    if (!this.headers.get('content-type')) {
        // 获取数据类型
        var a = bodyType(body)
        // 根据body重新设置content-type
        switch (a) {
            case 'text':
                this.headers.set('content-type', 'text/plain;charset=UTF-8')
                break
            case 'blob':
                if (body && body.type) {
                    this.headers.set('content-type', body.type)
                }
                break
            case 'searchParams':
                this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
                break
        }
    }
}

/**
 * @description 设置body使用状态
 * @param {response/responseText} body
 * @returns {Promise} promise
 * @private
 */
function consumeBody(body) {
    if (body.bodyUsed) {
        return Promise.reject(new TypeError('Already read'))
    } else {
        body.bodyUsed = true
        return Promise.resolve(body._body)
    }
}

/**
 * @description 解析body
 * @param {response/responseText} body 
 * @param {string} to text,blob,formData,json,arrayBuffer
 * @private
 */
function convertBody(body, to) {
    // 获取body的数据类型
    var from = bodyType(body)
    if (body === null || body === void 0 || !from || from === to) {
        return Promise.resolve(body)
    } else if (map[to] && map[to][from]) {
        // 执行解析
        return map[to][from](body)
    } else {
        return Promise.reject(new Error('Convertion from ' + from + ' to ' + to + ' not supported'))
    }
}

/**
 * @description 映射函数表(解析类型->解析body函数)
 * @private
 */
var map = {
    text: {
        json: function (body) {//json --> text
            return Promise.resolve(JSON.stringify(body))
        },
        blob: function (body) {//blob --> text
            return blob2text(body)
        },
        searchParams: function (body) {//searchParams --> text
            return Promise.resolve(body.toString())
        }
    },
    json: {
        text: function (body) {//text --> json
            return Promise.resolve(parseJSON(body))
        },
        blob: function (body) {//blob --> json
            return blob2text(body).then(parseJSON)
        }
    },
    formData: {
        text: function (body) {//text --> formData
            return text2formData(body)
        }
    },
    blob: {
        text: function (body) {//json --> blob
            return Promise.resolve(new Blob([body]))
        },
        json: function (body) {//json --> blob
            return Promise.resolve(new Blob([JSON.stringify(body)]))
        }
    },
    arrayBuffer: {
        blob: function (body) {
            return blob2ArrayBuffer(body)
        }
    }
}

/**
 * @description 获取body的数据类型
 * @param {string/blob/formData/URLSearchParams/json} body 主体
 * @private
 */
function bodyType(body) {
    if (typeof body === 'string') {
        return 'text'
    } else if (support.blob && (body instanceof Blob)) {
        return 'blob'
    } else if (support.formData && (body instanceof FormData)) {
        return 'formData'
    } else if (support.searchParams && (body instanceof URLSearchParams)) {
        return 'searchParams'
    } else if (body && typeof body === 'object') {
        return 'json'
    } else {
        return null
    }
}

/**
 * @description text->formdata
 * @param {string} body 主体
 * @private
 */
function text2formData(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function (bytes) {
        if (bytes) {
            var split = bytes.split('=')
            var name = split.shift().replace(/\+/g, ' ')
            var value = split.join('=').replace(/\+/g, ' ')
            form.append(decodeURIComponent(name), decodeURIComponent(value))
        }
    })
    return Promise.resolve(form)
}

/**
 * @description blob->arraybuffer
 * @param {blob} body 主体
 * @private
 */
function blob2ArrayBuffer(blob) {
    var reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    return reader2Promise(reader)
}

/**
 * @description blob->text
 * @param {blob} body 主体
 * @private
 */
function blob2text(blob) {
    var reader = new FileReader()
    reader.readAsText(blob)
    return reader2Promise(reader)
}

/**
 * @description string->json
 * @param {string} body 主体
 * @private
 */
function parseJSON(body) {
    try {
        return JSON.parse(body)
    } catch (ex) {
        throw 'Invalid JSON'
    }
}

/**
 * @description blob->arraybuffer/text
 * @param {FileReader} reader 
 * @private
 */
function reader2Promise(reader) {
    return new Promise(function (resolve, reject) {
        reader.onload = function () {
            resolve(reader.result)
        }
        reader.onerror = function () {
            reject(reader.error)
        }
    })
}

/**
 * @exports Body
 */
module.exports = Body