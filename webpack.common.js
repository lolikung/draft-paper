var path = require('path');
let CleanWebpackPlugin = require('clean-webpack-plugin');

// 程式入口點
let entryPoint = path.resolve(__dirname, './src/', process.env.ENTRY_POINT);
let distPath = path.resolve(__dirname, './dist');
module.exports = {
    entry: ["babel-polyfill", entryPoint],
    output: {
        path: distPath,
        publicPath: '/dist/',
        filename: 'bundle.js'
    },
    plugins: [
        new CleanWebpackPlugin([distPath])
    ],
    resolve: {
        alias: {
            'lib': path.resolve(__dirname, 'src/lib'),
            'components': path.resolve(__dirname, 'src/components')
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        sass: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader?indentedSyntax'].join('!'),
                        js: 'babel-loader?presets[]=es2015'
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ["es2015"]
                },
                exclude: /(node_modules|\.min\.js$)/
            }
        ]
    }
};
