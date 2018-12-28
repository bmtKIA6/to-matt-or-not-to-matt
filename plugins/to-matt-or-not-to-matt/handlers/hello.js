

const internals = {};

internals.handler = () => 'Hello WillowTree!';

internals.get = {
    description: 'Hello from the system',
    tags: ['api'],
    auth: false,
    handler: internals.handler,
};

module.exports = {
    get: internals.get,
};
