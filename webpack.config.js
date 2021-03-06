const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const {src} = require("@babel/core/lib/vendor/import-meta-resolve");

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const cssLoaders = extra => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {},
        },
        'css-loader'
    ]

    if (extra) {
        loaders.push(extra)
    }

    return loaders
}

const babelOptions = preset => {
    const opts = {
        presets: [
            '@babel/preset-env'
        ],
        plugins: [
            '@babel/plugin-proposal-class-properties'
        ]
    }

    if (preset) {
        opts.presets.push(preset)
    }

    return opts
}


const jsLoaders = () => {
    const loaders = [{
        loader: 'babel-loader',
        options: babelOptions()
    }]

    return loaders
}

const plugins = () => {
    const base = [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/favicon/favicon.ico'),
                    to: path.resolve(__dirname, 'dist')
                },
                {
                    from: path.resolve(__dirname, 'src/server.js'),
                    to: path.resolve(__dirname, 'dist')
                }
            ]
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: filename('css')
        })
    ]
    // if (isProd) {
    //     base.push(new BundleAnalyzerPlugin())
    // }

    return base
}

module.exports = {
        context: path.resolve(__dirname, 'src'),
        mode: 'development',
        entry: {
            main: ['@babel/polyfill', './index.js'],
            //other: './analytics.js' //???????????? ?????????? ??????????
        },
        output: {
            filename: filename('js'),
            path: path.resolve(__dirname, 'dist'),
        },
        resolve: {
            extensions: ['.js', '.json', '.png'],
            alias: {
                '@models': path.resolve(__dirname, 'src/models'),
                '@': path.resolve(__dirname, 'src'),
            }
        },
        optimization: optimization(),
        devServer: {
            port: 3000,
            hot: isDev,
        },
        devtool: isDev ? 'source-map' : false,
        plugins: plugins(),
        module: {
            rules: [
                {
                    test: /\.html$/,
                    loader: 'html-loader',
                },
                {
                    test: /\.ejs$/i,
                    use: ['html-loader', 'template-ejs-loader'],
                },
                {
                    test: /\.css$/,
                    use: cssLoaders()
                },
                {
                    test: /\.less$/,
                    use: cssLoaders('less-loader')
                },
                {
                    test: /\.s[ac]ss$/,
                    use: cssLoaders('sass-loader')
                },
                {
                    test: /\.(ttf|woff|woff2|eot)$/,
                    type: 'asset/resource',
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',
                },
                {
                    test: /\.xml$/,
                    use: ['xml-loader']
                },
                {
                    test: /\.csv$/,
                    use: ['csv-loader']
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: jsLoaders()
                },

            ]
        }
    }
