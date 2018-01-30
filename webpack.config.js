var Webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var src = path.resolve(__dirname, './src');
var dist = path.resolve(__dirname, './dist');

module.exports = {
    entry: {
        src: src + '/index.js',
        vendor: [ 'svg-to-pdfkit', 'blob-stream' ]
    },
    output: {
        path: dist,
        filename: 'bundle.app.js'
    },
    devServer: {
        port: 3002,
        open: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.template.ejs',
            filename: 'index.html'
        }),
        new Webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity,
            filename: 'bundle.vendor.js'
        })
    ]
};