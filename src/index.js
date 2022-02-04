const path = require('path');
const Ykush = require('./Ykush');
const Ykushxs = require('./Ykushxs');
const Ykush3 = require('./Ykush3');

const ykushcmdPath = path.join(__dirname, '..', 'bin', process.platform);
const includedYkushCmd = path.join(ykushcmdPath, 'ykushcmd');

Ykush.YkushCmd = includedYkushCmd;

const overrideYkushCmdPath = (newPath) => {
    Ykush.YkushCmd = newPath;
};

module.exports = {
    Ykush, Ykushxs, Ykush3, overrideYkushCmdPath
};
