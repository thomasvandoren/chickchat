/* eslint key-spacing:0 spaced-comment:0 */
import path from "path"
import {argv} from "yargs"

const config = {
    env: process.env.NODE_ENV || 'development',

    // ----------------------------------
    // Project Structure
    // ----------------------------------
    path_base: path.resolve(__dirname, '../'),
    dir_client: 'src',
    dir_dist: argv.dist || 'dist',
    dir_test: 'test',

    // ----------------------------------
    // Server Configuration
    // ----------------------------------
    server_host: process.env.HOST || 'localhost',
    server_port: process.env.PORT || 3000,

    // ----------------------------------
    // Compiler Configuration
    // ----------------------------------
    compiler_debug: false,
    compiler_devtool: argv.devtool === false ? null : '#inline-cheap-source-map',
    compiler_hash_type: 'hash',
    compiler_fail_on_warning: false,
    compiler_quiet: false,
    compiler_public_path: '@@ASSET_CDN@@',
    compiler_stats: {
        chunks: false,
        chunkModules: false,
        colors: true
    },
    compiler_vendor: [
        'react'
    ],
    compiler_minify: argv.minify,
    compiler_compress: false,
    compiler_compression_pattern: /\.(js|css|html|svg|woff|woff2|ttf|eot)$/,
    compiler_extract_css: argv.extractCss,
    compiler_index_template: argv.indexTemplate || 'index.html'
};

/************************************************
 -------------------------------------------------

 All Internal Configuration Below
 Edit at Your Own Risk

 -------------------------------------------------
 ************************************************/

// ------------------------------------
// Environment
// ------------------------------------
config.globals = {
    'process.env': {
        'NODE_ENV': JSON.stringify(config.env),
        'API_URL': JSON.stringify(process.env.API_URL) || JSON.stringify('https://chick.chat')
    },
    '__DEV__': config.env === 'development',
    '__HMR__': config.env === 'development' && argv.hmr !== false
};

// ------------------------------------
// Utilities
// ------------------------------------
config.utils_paths = (() => {
    const resolve = path.resolve;

    const base = (...args) =>
        resolve.apply(resolve, [config.path_base, ...args]);

    return {
        base: base,
        client: base.bind(null, config.dir_client),
        dist: base.bind(null, config.dir_dist)
    }
})();

export default config
