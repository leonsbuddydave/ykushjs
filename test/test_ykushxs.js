// 3rd party modules
const chai = require('chai');
const {stub} = require('sinon');
const chaiAsPromised = require('chai-as-promised');
// application modules
const {Ykushxs, Ykush} = require('../src');

chai.use(chaiAsPromised);
const {expect} = chai;


describe('Ykushxs', function () {
    let ykushCmdBack;
    const logger = {debug: () => {}, silly: () => {}};
    beforeEach(function () {
        stub(Ykush, 'execa');
        ykushCmdBack = Ykush.YkushCmd;
        Ykush.YkushCmd = 'ykushcmd';
        Ykush.execa.resolves({stdout: ''});
    });
    afterEach(function () {
        Ykush.execa.restore();
        Ykush.YkushCmd = ykushCmdBack;
    });
    it('is ok', function () {
        const obj = new Ykushxs('123', {logger});
        expect(obj).to.be.ok;
    });
    it('serialNumber', async function () {
        const ykush = new Ykushxs('123', {logger});
        const sn = ykush.serialNumber;
        expect(sn).to.be.equal('123');
    });
    it('powerOn', async function () {
        const ykush = new Ykushxs('123', {logger});
        await ykush.powerOn();
        expect(Ykush.execa.calledOnceWith('ykushcmd', ['ykushxs', '-s', '123', '-u'])).to.be.true;
    });
    it('powerOff', async function () {
        const ykush = new Ykushxs('123', {logger});
        await ykush.powerOff();
        expect(Ykush.execa.calledOnceWith('ykushcmd', ['ykushxs', '-s', '123', '-d'])).to.be.true;
    });
    it('powerAllOn', async function () {
        const ykush = new Ykushxs('123', {logger});
        await ykush.powerAllOn();
        expect(Ykush.execa.calledOnceWith('ykushcmd', ['ykushxs', '-s', '123', '-u'])).to.be.true;
    });
    it('powerAllOff', async function () {
        const ykush = new Ykushxs('123', {logger});
        await ykush.powerAllOff();
        expect(Ykush.execa.calledOnceWith('ykushcmd', ['ykushxs', '-s', '123', '-d'])).to.be.true;
    });
    it('list', async function () {
        Ykush.execa.resolves({
            stdout: 'Attached YKUSHXS Boards:\n'
                + '1. Board found with serial number: YK1\n'
                + '2. Board found with serial number: YK2'
        });
        const list = await Ykushxs.list(logger);
        expect(list).to.be.deep.equal([{id: 'YK1'}, {id: 'YK2'}]);
    });
});
