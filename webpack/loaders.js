const path = require('path');

const sources = path.resolve('./src');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

exports.tslint = {
    test: /\.tsx?$/,
    use: 'tslint',
    include: [
        sources,
    ],
};

exports.tsx = {
    test: /\.tsx?$/,
    loaders: ['awesome-typescript-loader'],
    include: [
        sources,
    ],
};

exports.html = {
    test: /\.html$/,
    use: 'raw-loader',
    include: [
        sources,
    ],
};

exports.less = {
    test: /\.less$/,
    include: [
        sources,
        path.resolve(__dirname, '../node_modules/antd')
    ],
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
                loader: 'css-loader',
                options: {
                    minimize: process.env.NODE_ENV === 'production'
                }
            },
            {
                loader: 'less-loader'
            }
        ]
    })
};

exports.css = {
    test: /\.css$/,
    include: [
        sources,
        path.resolve(__dirname, '../node_modules/antd')
    ],
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
            loader: 'css-loader',
            options: {
                minimize: process.env.NODE_ENV === 'production'
            }
        }]
    })
};
const lessExtractTextPlugin = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [{
            loader: 'css-loader',
            options: {
                minimize: process.env.NODE_ENV === 'production'
            }
        },
        {
            loader: 'less-loader'
        }
    ]
});

exports.less = {
    test: /\.less$/,
    include: [
        sources,
        path.resolve(__dirname, '../node_modules/antd')
    ],
    use: lessExtractTextPlugin
};

function makeUrlLoader(pattern) {
    return {
        test: pattern,
        use: 'url-loader',
        include: [
            sources,
        ],
    };
}
exports.image = makeUrlLoader(/\.(png|jpg)$/i);
exports.svg = makeUrlLoader(/\.svg$/);
exports.eot = makeUrlLoader(/\.eot$/);
exports.woff = makeUrlLoader(/\.woff$/);
exports.woff2 = makeUrlLoader(/\.woff2$/);
exports.ttf = makeUrlLoader(/\.ttf$/);