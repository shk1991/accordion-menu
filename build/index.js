const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const pluginsText = '\r * built by `sunhongkui` \r';

const DIST = 'dist';
const DISTSTATIC = 'static';

const isProduction = process.env.NODE_ENV === 'production';
const cssLoader = [
    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
    'css-loader',
    'postcss-loader'
];
const sassLoader = cssLoader.concat('sass-loader');
const vueCssLoader = cssLoader.slice(0,-1).join('!');
const vueSassLoader = vueCssLoader + '!sass-loader';

const outputFilename = isProduction ? '[name].[hash:8].[ext]' : '[name].[ext]?[hash]';
const outputJsname = isProduction ? '[name].[chunkhash:8].js' : '[name].js';

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}
module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        "main": "src/main.js"
    },
    output: {
        publicPath: '/',
        path: path.resolve(__dirname, `../${DIST}`),
        filename: `${DISTSTATIC}/js/${outputJsname}`,
        chunkFilename: `${DISTSTATIC}/js/${outputJsname}`
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: isProduction ? `${DISTSTATIC}/css/[name].[hash:8].css` : `${DISTSTATIC}/css/[name].css`,
            chunkFilename: isProduction ? `${DISTSTATIC}/css/[id].[hash:8].css` : `${DISTSTATIC}/css/[id].css`
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            minify: {
                minimize: true,
                removeComments: true,
                collapseWhitespace: true
            },
            inject: "body",
            hash: true,
            chunks: ['modules',"vendor","main"],
            chunksSortMode: function(a, b) {
               var orders = ['modules','vendor', 'main'];
               return orders.indexOf(a.id) - orders.indexOf(b.id);
            }
        }),
        new webpack.optimize.SplitChunksPlugin({
            chunks: "all",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
                main: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    name: 'modules'
                }
            }
        }),
        isProduction ? new webpack.BannerPlugin(pluginsText) : new FriendlyErrorsPlugin()
    ],
    module: {
        rules: [
            { test: /\.js$/, include: [resolve('src')], loader:'babel-loader' },
            { 
                test: /\.tsx?$/, 
                loader: 'ts-loader', 
                exclude: /node_modules/
            },
            { test: /\.css$/, use: cssLoader },
            { test: /\.(scss|sass)$/, use: sassLoader },
            { test: /\.json$/, type: "javascript/auto" },
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: {
                            cssModules: {
                                localIdentName: '[path][name]---[local]---[hash:base64:5]',
                                camelCase: true
                            },
                            loaders: {
                                scss: vueSassLoader,
                                sass: vueSassLoader, // + '?indentedSyntax',
                                css: vueCssLoader,
                                js: 'babel-loader',
                                ts: 'ts-loader'
                            },
                            transformToRequire: {
                              a: ['href']
                            }
                        }
                    }
                ] 
            },
            {
                test: require.resolve('jquery'),  // 此loader配置项的目标是NPM中的jquery
                use: [{
                    loader: 'expose-loader',
                    options: 'jQuery'
                },{
                    loader: 'expose-loader',
                    options: '$'
                }]
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                loader:'url-loader',
                options: {
                    limit: 10000,
                    name: `${DISTSTATIC}/images/` + outputFilename
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: `${DISTSTATIC}/media/` + outputFilename
                }
            },
            {
                test: /\.(pdf|docx?)(\?.*)?$/,
                loader: 'file-loader',
                options: {
                    // name: `${DISTSTATIC}/data/` + outputFilename
                    name: `${DISTSTATIC}/data/[name].[ext]`
                }
            },
            {
                test: /\.(ttf|woff2?|svg|eot)$/,
                loader:'file-loader',
                options: {
                    name: `${DISTSTATIC}/fonts/` + outputFilename
                }
            }
        ]
    },
    // 其他配置
    resolve: {
        modules: [
            process.cwd(),
            "node_modules"
        ],
        extensions: ['.js','.vue','.json','.ts'],
        alias: {
            '@':                resolve('src'),
            'vue':              'vue/dist/vue.esm.js',
            'accordion':           'src/js/modules/accordion.js'
        }
    },
    node: {
        setImmediate: false,
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    },
    mode: process.env.NODE_ENV
};

if (!isProduction) {
    /*module.exports.module.rules.unshift({
        test: /\.(js|vue)$/,
        loader: "eslint-loader", 
        enforce: 'pre',
        include: [resolve('src')],
        options: {
            formatter: require('eslint-friendly-formatter'),
            emitWarning: false
        }
    })*/
}