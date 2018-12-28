
const Code = require('code');
const Lab = require('lab');
const Glue = require('glue');

const { expect } = Code;
const {
    test, before, experiment,
} = exports.lab = Lab.script();

const Manifest = require('../../../../../config/manifest');

let server;

before(async () => {
    const options = {
        relativeTo: `${__dirname}/../../../../..`,
    };

    // load server
    server = await Glue.compose(Manifest, options);
    await server.start();
});

experiment('test /gameplay create', () => {
    test('endpoint should return 401 w/o authorization', async () => {
        const options = {
            method: 'post',
            url: '/gameplay',
        };

        const res = await server.inject(options);

        expect(res.statusCode).to.equal(401);
    });


    test('endpoint should return 400 for invalid payload', async () => {
        const options = {
            method: 'post',
            url: '/gameplay',
            headers: {
                Authorization: 'Basic c29tZXVzZXI6c29tZXBhc3N3b3Jk',
            },
            payload: {
                type: 'gues',
            },
        };

        const res = await server.inject(options);

        expect(res.statusCode).to.equal(400);
    });

    test('endpoint should return 200 w/ authorization', async () => {
        const options = {
            method: 'post',
            url: '/gameplay',
            headers: {
                Authorization: 'Basic c29tZXVzZXI6c29tZXBhc3N3b3Jk',
            },
            payload: {
                type: 'guess_6',
            },
        };

        const res = await server.inject(options);
        const payload = JSON.parse(res.payload);

        expect(res.statusCode).to.equal(200);
        expect(payload.type).to.equal('guess_6');
        expect(payload.score).to.equal(0);
        expect(payload.tries).to.equal(0);
        expect(payload.gameData.entries.length).to.equal(6);
    });
});
