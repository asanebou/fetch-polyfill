/**
 * @description 
 * @module asanebou
 * @author asanebou
 */

var Request = require('./Request')
var Response = require('./Response')
var fetch = require('./fetch')
var Headers = require('./Headers')

function asanebou() {

}

window.asanebou = window.asanebou || asanebou

if (typeof window.asanebou === 'function') {
    window.asanebou.fetch = fetch
    window.asanebou.Request = Request
    window.asanebou.Response = Response
    window.asanebou.Headers = Headers
}

