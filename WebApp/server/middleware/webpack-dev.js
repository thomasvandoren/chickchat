import WebpackDevMiddleware from "webpack-dev-middleware"
import config from "../../config"

const paths = config.utils_paths;
const {__HMR__} = config.globals;
const debug = require('debug')('app:server:webpack-dev');

export default function (compiler, publicPath) {
    debug('Enable webpack dev middleware.');

    return WebpackDevMiddleware(compiler, {
        publicPath,
        contentBase: paths.base(config.dir_client),
        hot: __HMR__,
        quiet: config.compiler_quiet,
        noInfo: config.compiler_quiet,
        lazy: false,
        stats: config.compiler_stats
    })
}
