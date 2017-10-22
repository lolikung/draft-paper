let merge = require('webpack-merge');
let common = require('./webpack.common.js');

module.exports = merge(common, {
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.js',
            'vuex$': 'vuex/dist/vuex.js'
        }
    },
    module: {
        noParse: [
            /\/vue\/dist\/vue\.js$/,
            /\/vuex\/dist\/vuex\.js$/,
            /\.min\.js$/
        ],
        rules: [
            {
                test: /\.(png|jpg|gif|svg|mp3)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]',
                }
            }
        ]
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map',
    devServer: {
        host: "0.0.0.0",
        disableHostCheck: true
    }
});
