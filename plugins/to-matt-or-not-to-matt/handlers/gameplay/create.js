

const Joi = require('joi');
const Models = require('../../models');
const GameFactory = require('./game-factory');

const internals = {};

internals.schema = Joi.object({
    type: Joi.string().valid(Object.keys(Models.Gameplay.Type).map(key => Models.Gameplay.Type[key])).required(),
});

internals.createGame = request => GameFactory.create(request);

internals.handler = {

    description: 'Create a new game',
    tags: ['api'],
    validate: {

        payload: internals.schema,
    },
    handler: internals.createGame,
};

module.exports = internals.handler;
