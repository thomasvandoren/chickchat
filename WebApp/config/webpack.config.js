import webpack from "webpack"
import CleanWebpackPlugin from "clean-webpack-plugin"
import CompressionPlugin from "compression-webpack-plugin"
import ExtractTextPlugin from "extract-text-webpack-plugin"
import HtmlWebpackPlugin from "html-webpack-plugin"
import path from "path"
import config from "../config"

const debug = require('debug')('app:webpack:config');

const paths = config.utils_paths;
const {__HMR__} = config.globals;

debug('Create configuration.');
const webpackConfig = {
    name: 'client',
    target: 'web',
    debug: config.compiler_debug,
    devtool: config.compiler_devtool,
    devtoolModuleFilenameTemplate: '/[absolute-resource-path]',
    resolve: {
        root: [
            path.resolve(__dirname, '..'),
            path.resolve(__dirname, '../node_modules')
        ],
        modulesDirectories: [path.resolve(__dirname, '../node_modules'), 'node_modules'],
        extensions: ['', '.js']
    },
    resolveLoader: {
        root: path.join(__dirname, '../node_modules')
    },
    module: {}
};
// ------------------------------------
// Entry Points
// ------------------------------------
const APP_ENTRY_PATH = paths.base(config.dir_client) + '/app.js';

webpackConfig.entry = {
    app: __HMR__
        ? ['react-hot-loader/patch', APP_ENTRY_PATH, 'webpack-hot-middleware/client?path=/__webpack_hmr']
        : [APP_ENTRY_PATH],
    vendor: config.compiler_vendor
};

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
    filename: `[name].[${config.compiler_hash_type}].js`,
    path: paths.base(config.dir_dist),
    publicPath: config.compiler_public_path
};

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins = [
    new webpack.DefinePlugin(config.globals),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new HtmlWebpackPlugin({
        template: paths.client(config.compiler_index_template),
        hash: false,
        filename: 'index.html',
        inject: true,
        minify: {
            collapseWhitespace: true
        }
    }),
    new CleanWebpackPlugin([config.dir_dist], {
        root: config.path_base
    })
];

if (__HMR__) {
    debug('Enable plugins for live development (HMR, NoErrors).');
    webpackConfig.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    )
}

if (config.compiler_minify) {
    debug('Enable minification plugins (Dedupe & UglifyJS).');
    webpackConfig.plugins.push(
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                unused: true,
                dead_code: true
            },
            compressor: {
                warnings: false
            },
            sourceMap: true
        })
    )
}

if (config.compiler_compress) {
    webpackConfig.plugins.push(
        new CompressionPlugin({
            asset: '{file}',
            regExp: config.compiler_compression_pattern
        })
    )
}

// Don't split bundles during testing, since we only want import one bundle
webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    names: ['vendor'],
    minChunks: (module, count) => {
        return (
            module.resource &&
            module.resource.indexOf(path.resolve('node_modules')) === 0
        )
    }
}));

// Polyfill fetch for non test. In test we explicitly stub fetch
webpackConfig.plugins.push(new webpack.ProvidePlugin({
    'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
}))

// ------------------------------------
// Loaders
// ------------------------------------
// JavaScript / JSON
webpackConfig.module.loaders = [{
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel',
    query: {
        babelrc: false,
        cacheDirectory: true,
        plugins: [
            require.resolve('babel-plugin-transform-runtime'),
            require.resolve('babel-plugin-add-module-exports')
        ],
        presets: [
            require.resolve('babel-preset-es2015'),
            require.resolve('babel-preset-react'),
            require.resolve('babel-preset-stage-1')
        ]
    }
}, {
    test: /\.json$/,
    loader: 'json'
}];

// Styles
const cssLoader = [
    'css?modules',
    'sourceMap',
    'importLoaders=2',
    'localIdentName=[path][name]__[local]'
].join('&');

webpackConfig.module.loaders.push({
    test: /\.css$/,
    loader: 'style-loader'
});
webpackConfig.module.loaders.push({
    test: /\.css$/,
    loader: 'css-loader',
    query: {
        modules: true,
        localIdentName: '[name]__[local]__[hash:base64:5]'
    }
});

// File loaders
webpackConfig.module.loaders.push(
    {
        test: /\.(woff|woff2|ttf|eot|svg)$/,
        include: /fonts/,
        loader: 'file?name=[name].[hash].[ext]'
    },
    {
        test: /\.(png|jpg|svg)$/,
        include: /images/,
        exclude: /icons/,
        loaders: [
            'url?limit=8192&name=[name].[hash].[ext]',
            'image-webpack?bypassOnDebug'
        ]
    },
    {
        test: /\.(png|jpg|svg)$/,
        include: /static/,
        loaders: [
            'file?name=[name].[hash].[ext]',
            'image-webpack?bypassOnDebug'
        ]
    },
    {
        test: /\.svg$/,
        include: /images\/icons/,
        loader: 'svg-inline'
    }
);

// Auth0 loaders
webpackConfig.module.loaders.push(
    {
        test: /node_modules[\\\/]auth0-lock[\\\/].*\.js$/,
        loaders: [
            'transform-loader/cacheable?brfs',
            'transform-loader/cacheable?packageify'
        ]
    },
    {
        test: /node_modules[\\\/]auth0-lock[\\\/].*\.ejs$/,
        loader: 'transform-loader/cacheable?ejsify'
    }
);

// ------------------------------------
// Finalize Configuration
// ------------------------------------
// when we don't know the public path (we know it only when HMR is enabled [in development]) we
// need to use the extractTextPlugin to fix this issue:
// http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
if (config.compiler_extract_css) {
    debug('Enable CSS extraction.');
    webpackConfig.module.loaders.filter(loader =>
        loader.loaders && loader.loaders.find(name => (/css/).test(name.split('?')[0]))
    ).forEach(loader => {
        const [first, ...rest] = loader.loaders;
        loader.loader = ExtractTextPlugin.extract(first, rest.join('!'));
        delete loader.loaders
    });

    webpackConfig.plugins.push(
        new ExtractTextPlugin('[name].[contenthash].css', {
            allChunks: true
        })
    )
}

export default webpackConfig