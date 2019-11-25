// 3rd party modules
const chai = require('chai');
const {stub} = require('sinon');
const chaiAsPromised = require('chai-as-promised');
// application modules
const {Ykush3, Ykush} = require('../src');

chai.use(chaiAsPromised);
const {expect} = chai;


describe('Ykush3', function () {
    let ykushCmdBack;
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
        const obj = new Ykush3('123');
        expect(obj).to.be.ok;
    });
    it('powerOn', async function () {
        const ykush = new Ykush3('123');
        await ykush.powerOn({channel: 2});
        expect(Ykush.execa.calledOnceWith('ykushcmd', ['ykush3', '-s', '123', '-u', '2'])).to.be.true;
    });
    it('powerOff', async function () {
        const ykush = new Ykush3('123');
        await ykush.powerOff({channel: 2});
        expect(Ykush.execa.calledOnceWith('ykushcmd', ['ykush3', '-s', '123', '-d', '2'])).to.be.true;
    });
    it('powerAllOn', async function () {
        const ykush = new Ykush3('123');
        await ykush.powerAllOn();
        expect(Ykush.execa.calledOnceWith('ykushcmd', ['ykush3', '-s', '123', '-u', 'a'])).to.be.true;
    });
    it('powerAllOff', async function () {
        const ykush = new Ykush3('123');
        await ykush.powerAllOff();
        expect(Ykush.execa.calledOnceWith('ykushcmd', ['ykush3', '-s', '123', '-d', 'a'])).to.be.true;
    });
    it('switchOn5v', async function () {
        const ykush = new Ykush3('123');
        await ykush.switchOn5V();
        expect(Ykush.execa.calledOnceWith('ykushcmd', ['ykush3', '-s', '123', '-on'])).to.be.true;
    });
    it('switchOff5v', async function () {
        const ykush = new Ykush3('123');
        await ykush.switchOff5V();
        expect(Ykush.execa.calledOnceWith('ykushcmd', ['ykush3', '-s', '123', '-off'])).to.be.true;
    });
    it('writeGPIO', async function () {
        const ykush = new Ykush3('123');
        await ykush.writeGPIO({gpio: '2', state: '1'});
        expect(Ykush.execa.calledOnceWith('ykushcmd', ['ykush3', '-s', '123', '-w', '2', '1'])).to.be.true;
    });
    it.skip('readGPIO', async function () {
        const ykush = new Ykush3('123');
        Ykush.execa.resolves({
            stdout: '1'
        });
        const {state} = await ykush.readGPIO({gpio: '1'});
        expect(Ykush.execa.calledOnceWith('ykushcmd', ['ykush3', '-s', '123', '-r', '1'])).to.be.true;
        expect(state).to.be.equal('1');
    });
    it('reset', async function () {
        const ykush = new Ykush3('123');
        await ykush.reset();
        expect(Ykush.execa.calledOnceWith('ykushcmd', ['ykush3', '-s', '123', '--reset'])).to.be.true;
    });
    it('list', async function () {
        Ykush.execa.resolves({
            stdout: 'Attached YKUSH3 Boards:\n'
                + '1. Board found with serial number: YK1\n'
                + '2. Board found with serial number: YK2'
        });
        const list = await Ykush3.list();
        expect(list).to.be.deep.equal([{id: 'YK1'}, {id: 'YK2'}]);
    });
});
