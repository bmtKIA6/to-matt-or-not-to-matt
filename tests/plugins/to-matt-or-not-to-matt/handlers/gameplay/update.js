
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

experiment('test /gameplay update', () => {
    test('endpoint should return 401 w/o authorization', async () => {
        const options = {
            method: 'put',
            url: '/gameplay/1',
        };

        const res = await server.inject(options);

        expect(res.statusCode).to.equal(401);
    });

    test('endpoint should return 404 non-existing game', async () => {
        const options = {
            method: 'put',
            url: '/gameplay/0',
            headers: {
                Authorization: 'Basic c29tZXVzZXI6c29tZXBhc3N3b3Jk',
            },
            payload: {
                guess: {
                    entries: [
                        {
                            id: 'string',
                            name: 'string',
                        },
                        {
                            id: 'string',
                            name: 'string',
                        },
                        {
                            id: 'string',
                            name: 'string',
                        },
                        {
                            id: 'string',
                            name: 'string',
                        },
                        {
                            id: 'string',
                            name: 'string',
                        },
                        {
                            id: 'string',
                            name: 'string',
                        },

                    ],
                },
            },
        };

        const guessResponse = await server.inject(options);

        expect(guessResponse.statusCode).to.equal(404);
    });


    test('endpoint should return 400 for invalid payload', async () => {
        const createOptions = {
            method: 'post',
            url: '/gameplay',
            headers: {
                Authorization: 'Basic c29tZXVzZXI6c29tZXBhc3N3b3Jk',
            },
            payload: {
                type: 'guess_6',
            },
        };

        const res = await server.inject(createOptions);
        const newGame = JSON.parse(res.payload);

        const options = {
            method: 'put',
            url: `/gameplay/${newGame.id}`,
            headers: {
                Authorization: 'Basic c29tZXVzZXI6c29tZXBhc3N3b3Jk',
            },
            payload: {
                guess: {
                    entries: [
                        {
                            id: 'string',
                            name: 'string',
                        },
                    ],
                },
            },
        };

        const guessResponse = await server.inject(options);

        expect(guessResponse.statusCode).to.equal(400);
    });

    test('endpoint should return 200 for valid payload', async () => {
        const createOptions = {
            method: 'post',
            url: '/gameplay',
            headers: {
                Authorization: 'Basic c29tZXVzZXI6c29tZXBhc3N3b3Jk',
            },
            payload: {
                type: 'guess_6',
            },
        };

        const res = await server.inject(createOptions);
        const newGame = JSON.parse(res.payload);

        const options = {
            method: 'put',
            url: `/gameplay/${newGame.id}`,
            headers: {
                Authorization: 'Basic c29tZXVzZXI6c29tZXBhc3N3b3Jk',
            },
            payload: {
                guess: {
                    entries: [
                        {
                            id: 'string',
                            name: 'string',
                        },
                        {
                            id: 'string',
                            name: 'string',
                        },
                        {
                            id: 'string',
                            name: 'string',
                        },
                        {
                            id: 'string',
                            name: 'string',
                        },
                        {
                            id: 'string',
                            name: 'string',
                        },
                        {
                            id: 'string',
                            name: 'string',
                        },
                    ],
                },
            },
        };

        const guessResponse = await server.inject(options);
        const payload = JSON.parse(guessResponse.payload);

        expect(guessResponse.statusCode).to.equal(200);
        expect(payload.score).to.be.equal(0);
        expect(payload.guess.entries.length).to.be.equal(0);
    });

    test('endpoint should return 200 for valid payload', async () => {
        const createOptions = {
            method: 'post',
            url: '/gameplay',
            headers: {
                Authorization: 'Basic c29tZXVzZXI6c29tZXBhc3N3b3Jk',
            },
            payload: {
                type: 'guess_6',
            },
        };

        const res = await server.inject(createOptions);
        const newGame = JSON.parse(res.payload);

        const entryCount = newGame.gameData.entries.length;
        const guessEntries = newGame.gameData.entries.map((entry) => {
            const randIdx = Math.floor(Math.random() * entryCount);
            return {
                id: entry.id,
                name: newGame.gameData.names[randIdx],
            };
        });
        const options = {
            method: 'put',
            url: `/gameplay/${newGame.id}`,
            headers: {
                Authorization: 'Basic c29tZXVzZXI6c29tZXBhc3N3b3Jk',
            },
            payload: {
                guess: {
                    entries: guessEntries,
                },
            },
        };

        const guessResponse = await server.inject(options);
        const payload = JSON.parse(guessResponse.payload);

        expect(guessResponse.statusCode).to.equal(200);
        expect(payload.guess.entries.length).to.be.equal(6);
    });
});
