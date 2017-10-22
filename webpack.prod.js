let webpack = require('webpack');
let merge = require('webpack-merge');
let common = require('./webpack.common.js');

module.exports = merge(common, {
    module: {
        noParse: [
            /\/vue\/dist\/vue\.min\.js$/,
            /\/vuex\/dist\/vuex\.min\.js$/,
            /\.min\.js$/
        ],
        rules: [{
            test: /\.(png|jpg|gif|svg|mp3)$/,
            loader: 'url-loader',
            options: {
                name: '[name].[ext]?[hash]'
            }
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ],
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.min.js',
            'vuex$': 'vuex/dist/vuex.min.js',
        }
    },
    performance: {
        hints: false
    },
    devtool: ''
});