import express from "express"
import historyApiFallback from "connect-history-api-fallback"
import webpack from "webpack"
import config from "../config"

const paths = config.utils_paths;
const {__HMR__} = config.globals;

const app = express();

app.use(historyApiFallback({
    verbose: false
}));

const webpackConfig = require('../config/webpack.config');
const compiler = webpack(webpackConfig);

const {publicPath} = webpackConfig.output;


const webpackDev = require('./middleware/webpack-dev')
app.use(webpackDev(compiler, publicPath));
if (__HMR__) {
    app.use(require('./middleware/webpack-hmr')(compiler))
}

app.use(express.static(paths.client('assets/static')));

app.get('/env.js', (req, res) => {
    res.type('application/javascript');
    res.send(`
    window.ChickChat = {
      apiUrl: '${process.env.API_URL}',
      assetCdn: ''
    }
  `)
});

export default app
