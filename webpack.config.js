var webpack = require('webpack');

var path = require('path');


function heredoc(fn) {
    return fn.toString().replace(/^[^\/]+\/\*!?\s?/, '').
        replace(/\*\/[^\/]+$/, '').trim().replace(/>\s*</g, '><')
}

module.exports = {
    entry: {
        index: './src/asanebou'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'asanebou.js',
        libraryTarget: 'umd',
        library: 'fetch'
    }, //页面引用的文件
    resolve: {
        extensions: ['.js', ''],
        alias: {
        }
    }
}
