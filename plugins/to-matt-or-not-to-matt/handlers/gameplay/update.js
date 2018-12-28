

const Joi = require('joi');
const Boom = require('boom');
const Models = require('../../models');

const internals = {};

internals.updateSchema = Joi.object({
    guess: Joi.object({
        entries: Joi.array().items(Joi.object({
            id: Joi.string().required(),
            name: Joi.string().required(),
        })).length(6).required(),
    }).required(),
});

internals.updateGuess6 = (request, game) => {
    const guesses = request.payload.guess.entries;
    const ids = guesses.map(profile => profile.id);

    return Models.Profile.findAll({
        where: {
            id: ids,
        },
    }).then((profiles) => {
        let matchCount = 0;
        const outputEntries = [];

        profiles.forEach((profile) => {
            guesses.forEach((guess) => {
                if (profile.id === guess.id) {
                    const entry = {
                        id: profile.id,
                        name: guess.name,
                        match: false,
                    };

                    if (profile.fullName === guess.name) {
                        matchCount += 1;
                        entry.match = true;
                    }
                    outputEntries.push(entry);
                }
            });
        });

        const score = matchCount / 6;
        game.tries += 1;
        game.score = score;
        game.save();

        return {
            score,
            tries: game.tries,
            guess: {
                entries: outputEntries,
            },
        };
    });
};

internals.updateGameplay = request => Models.Gameplay.findByPk(request.params.id)
    .then((game) => {
        if (!game) {
            return Boom.notFound(`Game id: ${request.params.id} not found`);
        }

        if (game.type === Models.Gameplay.Type.GUESS_6) {
            return internals.updateGuess6(request, game);
        }

        throw new Error(`${game.type} type is not supported`);
    }).catch(err => Boom.badRequest(`Failed to update gameplay id ${request.params.id} (${err.message})`));

internals.update = {
    description: 'Perform a guess',
    tags: ['api'],
    validate: {
        params: {
            id: Joi.string().required(),
        },
        payload: internals.updateSchema,
    },
    handler: internals.updateGameplay,
};

module.exports = internals.update;
