

const Code = require('code');
const Lab = require('lab');
const Glue = require('glue');

const { expect } = Code;
const {
    test, before, experiment,
} = exports.lab = Lab.script();

const Manifest = require('../../../../config/manifest');

let server;

before(async () => {
    const options = {
        relativeTo: `${__dirname}/../../../..`,
    };

    // load server
    server = await Glue.compose(Manifest, options);
    await server.start();
});

experiment('test /hello', () => {
    test('endpoint should return 200 w/o authorization', async () => {
        const options = {
            method: 'get',
            url: '/hello',
        };

        const res = await server.inject(options);

        expect(res.statusCode).to.equal(200);
        expect(res.payload).to.equal('Hello WillowTree!');
    });
});
