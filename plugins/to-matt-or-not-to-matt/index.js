
const Hoek = require('hoek');
const Wreck = require('wreck');
const Promise = require('bluebird');
const HapiAuthBasic = require('hapi-auth-basic');
const Self = require('./package.json');
const Models = require('./models');
const Routes = require('./routes');

const internals = {};

internals.populateDB = async (server, url) => {
    const { res, payload } = await Wreck.get(url, { json: 'force' });

    const findOrCreateProfile = (profile) => {
        const profileData = {
            id: profile.id,
            lastName: profile.lastName,
            firstName: profile.firstName,
            jobTitle: profile.jobTitle,
            slug: profile.slug,
            headshot_url: profile.headshot.url,
        };

        return Models.Profile.findOrCreate({
            where: {
                id: profile.id,
            },
            defaults: profileData,
        });
    };

    if (res.statusCode === 200) {
        return Promise.mapSeries(payload, findOrCreateProfile);
    }

    throw new Error('Failed to populate the database');
};

// All users and passwords are valid
internals.validateUser = (request, username) => ({
    isValid: true,
    credentials: {
        id: username,
        name: username,
    },
});

internals.registerAuth = async (server) => {
    await server.register(HapiAuthBasic);

    server.auth.strategy('basic', 'basic', {
        validate: internals.validateUser,
    });

    server.auth.default('basic');
};

internals.register = async (server, options) => {
    server.log(`Initializing plugin with ${JSON.stringify(options)}`);

    Hoek.assert(typeof options !== 'undefined', 'Plugin options are not set');
    Hoek.assert(typeof options.profile !== 'undefined', 'Plugin, options.profile is not set');
    Hoek.assert(typeof options.profile.url !== 'undefined', 'Plugin, options.profile.url is set');

    await internals.registerAuth(server);

    return Models.sequelize
        .authenticate()
        .then(() => Models.sequelize.sync()).then(() => internals.populateDB(server, options.profile.url)).then(() => {
            server.route(Routes);
        })
        .catch((err) => {
            // Something bad happened!!!
            Hoek.assert(!err, `Unable to connect to the database, or else: ${err.message} ${err.sql}`);
        });
};

exports.plugin = {
    pkg: Self,
    register: internals.register,
};

exports.validateUser = internals.validateUser;
exports.populateDB = internals.populateDB;
