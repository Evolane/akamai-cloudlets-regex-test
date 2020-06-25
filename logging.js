const debug = require('debug')
if (!debug.enabled('info')) {
    debug.enable('*,-verbose*,-debug*')
}

class log {
    constructor(name) {
        this.name = name
        this.init(name)
    }
    init(name) {
        debug.log = console.log.bind(console);
        this._debug = debug('debug:'+name)
        this._verbose = debug('verbose:'+name)
        this._info = debug('info:'+name)
        this._info.log = console.info.bind(console)
        this._warning = debug('warning:'+name)
        this._warning.log = console.info.bind(console)
        this._error = debug('error:'+name)
        this._error.log = console.error.bind(console)
        this._critical = debug('critical:'+name)
        this._critical.log = console.error.bind(console)
    }

    get verbose() {
        return this._verbose
    }
    get debug() {
        return this._debug
    }
    get info() {
        return this._info
    }
    get warning() {
        return this._warning
    }
    get error() {
        return this._error
    }
    get critical() {
        return this._critical
    }
}
module.exports = log