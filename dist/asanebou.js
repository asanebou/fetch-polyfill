(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["fetch"] = factory();
	else
		root["fetch"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @description 
	 * @module asanebou
	 * @author asanebou
	 */

	var Request = __webpack_require__(1)
	var Response = __webpack_require__(5)
	var fetch = __webpack_require__(6)
	var Headers = __webpack_require__(2)

	function asanebou() {

	}

	window.asanebou = window.asanebou || asanebou

	if (typeof window.asanebou === 'function') {
	    window.asanebou.fetch = fetch
	    window.asanebou.Request = Request
	    window.asanebou.Response = Response
	    window.asanebou.Headers = Headers
	}



/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @description HTTP报文-請求報文
	 * @module Request
	 * @author asanebou
	 */

	/**
	* @requires module:Headers
	* @requires module:Body
	*/
	var Headers = __webpack_require__(2)
	var Body = __webpack_require__(4)

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

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @description HTTP报文的首部对象
	 * @module Headers
	 * @author asanebou
	 */

	/**
	 * @requires module:support
	 */
	var support = __webpack_require__(3)

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

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = {
	    searchParams: 'URLSearchParams' in window,
	    iterable: 'Symbol' in window && 'iterator' in window,
	    blob: 'FileReader' in window && 'Blob' in window && (function () {
	        try {
	            new Blob()
	            return true
	        } catch (e) {
	            return false
	        }
	    })(),
	    formData: 'FormData' in window,
	    arrayBuffer: 'ArrayBuffer' in window
	}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @description HTTP报文-主体
	 * @module Body
	 * @author asanebou
	 */

	/**
	* @requires module:support
	*/
	var support = __webpack_require__(3)

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

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @description HTTP报文-响应報文
	 * @module Response
	 * @author asanebou
	 */

	/**
	* @requires module:Headers
	* @requires module:Body
	*/
	var Headers = __webpack_require__(2)
	var Body = __webpack_require__(4)

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

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

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
	var Request = __webpack_require__(1)
	var Response = __webpack_require__(5)
	var Headers = __webpack_require__(2)
	var Transport = __webpack_require__(7)

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

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

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
	var AXO = __webpack_require__(8)
	var JSONP = __webpack_require__(9)
	var XDR = __webpack_require__(10)
	var XHR = __webpack_require__(11)

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

/***/ }),
/* 8 */
/***/ (function(module, exports) {

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

/***/ }),
/* 9 */
/***/ (function(module, exports) {

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

/***/ }),
/* 10 */
/***/ (function(module, exports) {

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

/***/ }),
/* 11 */
/***/ (function(module, exports) {

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

/***/ })
/******/ ])
});
;