import WebpackHotMiddleware from "webpack-hot-middleware"

const debug = require('debug')('app:server:webpack-hmr');

export default function (compiler, opts) {
    debug('Enable Webpack Hot Module Replacement (HMR).');

    return WebpackHotMiddleware(compiler, opts)
}
