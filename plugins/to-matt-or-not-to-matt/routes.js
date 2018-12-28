

const Hello = require('./handlers/hello');
const Gameplay = require('./handlers/gameplay');

const internals = {};

internals.routes = [

    { method: 'get', path: '/hello', config: Hello.get },
    { method: 'post', path: '/gameplay', config: Gameplay.create },
    { method: 'put', path: '/gameplay/{id}', config: Gameplay.update },
];

module.exports = internals.routes;
