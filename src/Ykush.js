const path = require('path');
// 3rd party modules
const execa = require('execa');
const invariant = require('invariant');

const ykushcmdPath = path.join(__dirname, '..', 'bin', process.platform);
const YkushCmd = path.join(ykushcmdPath, 'ykushcmd');


class Ykush {
    constructor(serialNumber, {logger}) {
        this._serialNumber = serialNumber;
        this.logger = logger;
        this.channelCount = 3;
        this._prefix = [];
    }

    get serialNumber() {
        return this._serialNumber;
    }

    static async _runYkushCmd(args, logger) {
        const cmd = Ykush.YkushCmd;
        logger.debug(`ykush cmd: 'cmd ${args.join(' ')}'`);
        const {stdout} = await Ykush.execa(cmd, args);
        logger.silly(`stdout: ${stdout}`);
        return {stdout};
    }

    async powerAllOn() {
        const args = [...this._prefix, '-s', this._serialNumber, '-u'];
        return Ykush._runYkushCmd(args, this.logger);
    }

    async powerAllOff() {
        const args = [...this._prefix, '-s', this._serialNumber, '-d'];
        return Ykush._runYkushCmd(args, this.logger);
    }

    _validateChannel(channel) {
        invariant(channel > 0, 'invalid channel');
        invariant(channel <= this.channelCount, `allowed channels are 1..${this.channelCount}`);
    }

    async powerOn({channel}) {
        this._validateChannel(channel);
        const args = ['-s', this._serialNumber, '-u', `${channel}`];
        return Ykush._runYkushCmd(args, this.logger);
    }

    async powerOff({channel}) {
        this._validateChannel(channel);
        const args = ['-s', this._serialNumber, '-d', `${channel}`];
        return Ykush._runYkushCmd(args, this.logger);
    }

    static async list(logger) {
        return Ykush._list(logger);
    }

    static async _list(logger, prefix = []) {
        const args = [...prefix, '-l'];
        const {stdout} = await Ykush._runYkushCmd(args, logger);
        return Ykush._parseList(stdout);
    }

    static _parseList(stdout) {
        if (stdout.indexOf('No YKUSH') !== -1) {
            return [];
        }
        return stdout.split('\n').reduce((prev, cur) => {
            const match = cur.match(/Board found with serial number: (.*)/);
            if (match) {
                prev.push({id: match[1]});
            }
            return prev;
        }, []);
    }
}

Ykush.execa = execa;
Ykush.YkushCmd = YkushCmd;
module.exports = Ykush;
