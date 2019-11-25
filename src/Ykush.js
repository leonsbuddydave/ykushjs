const path = require('path');
// 3rd party modules
const execa = require('execa');
const invariant = require('invariant');
const debug = require('debug')('Ykush');

const ykushcmdPath = path.join(__dirname, '..', 'bin', process.platform);
const YkushCmd = path.join(ykushcmdPath, 'ykushcmd');


class Ykush {
    constructor(serialNumber) {
        this._serialNumber = serialNumber;
        this.channelCount = 3;
        this._prefix = [];
    }

    get serialNumber() {
        return this._serialNumber;
    }

    static async _runYkushCmd(args) {
        const cmd = Ykush.YkushCmd;
        debug(`ykush cmd: 'cmd ${args.join(' ')}'`);
        const {stdout} = await Ykush.execa(cmd, args);
        debug(`stdout: ${stdout}`);
        return {stdout};
    }

    async powerAllOn() {
        const args = [...this._prefix, '-s', this._serialNumber, '-u', 'a'];
        return Ykush._runYkushCmd(args);
    }

    async powerAllOff() {
        const args = [...this._prefix, '-s', this._serialNumber, '-d', 'a'];
        return Ykush._runYkushCmd(args);
    }

    _validateChannel(channel) {
        channel = parseInt(channel, 10); // eslint-disable-line no-param-reassign
        invariant(channel > 0, 'invalid channel');
        invariant(channel <= this.channelCount, `allowed channels are 1..${this.channelCount}`);
    }

    async powerOn({channel}) {
        this._validateChannel(channel);
        const args = [...this._prefix, '-s', this._serialNumber, '-u', `${channel}`];
        return Ykush._runYkushCmd(args);
    }

    async powerOff({channel}) {
        this._validateChannel(channel);
        const args = [...this._prefix, '-s', this._serialNumber, '-d', `${channel}`];
        return Ykush._runYkushCmd(args);
    }

    static async list() {
        return Ykush._list();
    }

    static async _list(prefix = []) {
        const args = [...prefix, '-l'];
        const {stdout} = await Ykush._runYkushCmd(args);
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
