// 3rd party modules
const invariant = require('invariant');
// app modules
const Ykush = require('./Ykush');


module.exports = class Ykush3 extends Ykush {
    constructor(...args) {
        super(...args);
        this._prefix = Ykush3.Prefix;
    }

    async switchOn5V() {
        const args = [...this._prefix, '-s', this._serialNumber, '-on'];
        return Ykush._runYkushCmd(args);
    }

    async switchOff5V() {
        const args = [...this._prefix, '-s', this._serialNumber, '-off'];
        return Ykush._runYkushCmd(args);
    }

    async reset() {
        const args = [...this._prefix, '-s', this._serialNumber, '--reset'];
        return Ykush._runYkushCmd(args);
    }

    async writeGPIO({gpio, state}) {
        gpio = `${gpio}`; // eslint-disable-line no-param-reassign
        state = `${state}`; // eslint-disable-line no-param-reassign
        invariant(['1', '2', '3'].indexOf(gpio) !== -1, 'invalid gpio. Allowed values: 1,2,3');
        invariant(['0', '1'].indexOf(state) !== -1, `invalid state: ${state}`);
        const args = [...this._prefix, '-s', this._serialNumber, '-w', gpio, state];
        return Ykush._runYkushCmd(args);
    }

    /*
    // @todo parse stdio when format is known..
    async readGPIO({gpio}) {
        invariant(['1', '2', '3'].indexOf(gpio) !== -1, 'invalid gpio. Allowed values: 1,2,3');
        const args = [...this._prefix, '-s', this._serialNumber, '-r', gpio];
        const {stdout} = await Ykush._runYkushCmd(args);

        return {state: stdout};
    }
    */

    static get Prefix() {
        return ['ykush3'];
    }

    static async list() {
        return Ykush._list(Ykush3.Prefix);
    }
};
