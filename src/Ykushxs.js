// app modules
const Ykush = require('./Ykush');


module.exports = class Ykushxs extends Ykush {
    constructor(...args) {
        super(...args);
        this.channelCount = 1;
        this._prefix = Ykushxs.Prefix;
    }

    static get Prefix() {
        return ['ykushxs'];
    }

    async powerOn({channel = 1} = {}) {
        this._validateChannel(channel);
        const args = [...this._prefix, '-s', this._serialNumber, '-u'];
        return Ykush._runYkushCmd(args, this.logger);
    }

    async powerOff({channel = 1} = {}) {
        this._validateChannel(channel);
        const args = [...this._prefix, '-s', this._serialNumber, '-d'];
        return Ykush._runYkushCmd(args, this.logger);
    }

    static async list(logger = Ykush.dummyLogger) {
        return Ykush._list(logger, Ykushxs.Prefix);
    }
};
