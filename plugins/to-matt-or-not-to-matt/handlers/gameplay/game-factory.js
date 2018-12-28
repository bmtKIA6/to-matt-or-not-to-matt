const Boom = require('boom');
const Models = require('../../models');

const internals = {};

internals.createGuess6 = (request) => {
    const { credentials } = request.auth;

    const playData = {
        type: request.payload.type,
        session: credentials.id,
    };

    return Models.Profile
        .findAll({
            where: {
                headshot_url: {
                    [Models.sequelize.Op.ne]: null,
                },
            },
            order: [Models.sequelize.random()],
            limit: 6,
        }).then((profiles) => {
            const names = profiles.map(profile => profile.fullName);
            const entries = profiles.map(profile => ({
                id: profile.id,
                headshot_url: profile.headshot_url,
            }));

            return Models.Gameplay
                .create(playData)
                .then(game => ({
                    id: game.id,
                    type: game.type,
                    score: game.score,
                    tries: game.tries,
                    gameData: {
                        entries,
                        names,
                    },
                }));
        }).catch(err => Boom.badImplementation(`Failed to create a new game of type ${request.payload.type} ${err.message}`));
};

internals.createGame = (request) => {
    const gameType = request.payload.type;

    if (gameType === Models.Gameplay.Type.GUESS_6) {
        return internals.createGuess6(request);
    }

    throw new Error(`Unsupported game type ${gameType}`);
};

module.exports = {
    create: internals.createGame,
    createGuess6: internals.createGuess6,
};
