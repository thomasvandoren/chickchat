/**
 * @module config
 */
export default {
    get apiUrl() {
        return ensureConfig(config().apiUrl || process.env.API_URL, 'API_URL')
    }
}

function ensureConfig(configVal, configName) {
    if (__DEV__ && !configVal) {
        throw new Error(`Must define env variable '${configName}'.`)
    }

    return configVal
}

function config() {
    return window.BookConfig || {}
}

function assetCdn() {
    return config().assetCdn || ''
}
