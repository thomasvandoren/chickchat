import {argv} from "yargs"
export default (config) => ({
    compiler_debug: argv.debug !== false,
    compiler_public_path: '/'
})