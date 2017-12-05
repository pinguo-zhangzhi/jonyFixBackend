const path = require('path');
const loaders = require('./webpack/loaders');
const plugins = require('./webpack/plugins');

// FIXME: change next line if you don't want publish to gh-pages
const publicPath = (process.env.NODE_ENV === 'production') ? './' : '/';
module.exports = {
    entry: {
        app: ['./src/index.tsx'],
    },

    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].[hash].js',
        publicPath,
        sourceMapFilename: '[name].[hash].js.map',
        chunkFilename: '[id].chunk.js',
    },

    devtool: 'cheap-module-source-map',
    resolve: { extensions: ['.webpack.js', '.web.js', '.tsx', '.ts', '.js'] },
    plugins,

    target: 'electron-main',

    devServer: {
        historyApiFallback: { index: '/' },
    },

    module: {
        rules: [
            loaders.tsx,
            loaders.html,
            loaders.css,
            loaders.less,
            loaders.svg,
            loaders.image,
            loaders.eot,
            loaders.woff,
            loaders.woff2,
            loaders.ttf,
        ],
    },

};