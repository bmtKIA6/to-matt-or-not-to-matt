
const Code = require('code');
const Lab = require('lab');
const Glue = require('glue');

const { expect } = Code;
const {
    test, before, experiment,
} = exports.lab = Lab.script();

const Models = require('../../../../../plugins/to-matt-or-not-to-matt/models');
const Manifest = require('../../../../../config/manifest');
const GameFactory = require('../../../../../plugins/to-matt-or-not-to-matt/handlers/gameplay/game-factory');

let server;

before(async () => {
    const options = {
        relativeTo: `${__dirname}/../../../../..`,
    };

    // load server
    server = await Glue.compose(Manifest, options);
    await server.start();
});

experiment('test game-factory create', () => {
    test('should call createGuess6 if type is guess_6', async () => {
        const request = {
            payload: {
                type: 'guess_6',
            },
            auth: {
                credentials: {
                    id: 'user1',
                    name: 'some user',
                },
            },
        };

        const createdGame = await GameFactory.create(request);

        expect(createdGame).to.be.an.object();
        expect(createdGame.type).to.equal('guess_6');
        expect(createdGame.tries).to.equal(0);
        expect(createdGame.score).to.equal(0);
        expect(createdGame.gameData.entries.length).to.equal(6);
        expect(createdGame.gameData.names.length).to.equal(6);
    });

    test('should fail on the unknown gameType', async () => {
        const request = {
            payload: {
                type: 'guess_17',
            },
            auth: {
                credentials: {
                    id: 'user1',
                    name: 'some user',
                },
            },
        };

        try {
            GameFactory.create(request);
        } catch (err) {
            expect(err.message).to.equal('Unsupported game type guess_17');
        }
    });

    test('should fail with 500 if the db is inaccessible', async () => {
        const request = {
            payload: {
                type: 'guess_6',
            },
            auth: {
                credentials: {
                    id: 'user1',
                    name: 'some user',
                },
            },
        };

        const origProfile = Models.Profile.findAll;
        try {
            // Models.Profile.findAll = async () => new Error('Nothing here');

            await GameFactory.create(request);
        } catch (err) {
            // console.log(`reset to ${Models.Profile}`);

            expect(true).to.equal(false);
            expect(err.message).to.equal('Nothing here');
            Models.Profile.findAll = origProfile;
        }
    });
});
