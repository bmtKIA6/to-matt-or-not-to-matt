
process.env.NODE_ENV = 'test';

const Code = require('code');
const Lab = require('lab');
const Manifest = require('../../config/manifest');

const { expect } = Code;
const {
    test, experiment,
} = exports.lab = Lab.script();

experiment('test manifest loading', () => {
    test('manifest should load for local env', () => {
        expect(Manifest.server.debug).to.equal(false);
        expect(Manifest.server.port).to.equal(0);
        expect(Manifest.register.plugins.length).to.equal(1);

        delete require.cache[require.resolve('../../config/manifest')];
    });
});
