

const Confidence = require('confidence');
const Good = require('good');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Vision = require('vision');
const Version = require('../package.json').version;

let plugins = [{
    plugin: './plugins/to-matt-or-not-to-matt',
    options: {
        db: {
            url: {
                $filter: 'env',
                test: 'sqlite://profiles_test_db',
                $default: '$env.DB_URL',
            },
        },
        profile: {
            url: {
                $filter: 'env',
                local: 'http://192.168.1.66/profiles',
                $default: 'https://www.willowtreeapps.com/api/v1.0/profiles',
            },
        },
    },
}];

const HapiSwaggerDependencies = [
    Inert,
    Vision,
    {
        plugin: HapiSwagger,
        options: {
            documentationPath: '/',
            info: {
                title: 'To Matt Or Not To Matt API',
                version: Version,
            },
            securityDefinitions: {
                Bearer: {
                    type: 'apiKey',
                    name: 'Authorization',
                    in: 'header',
                },
            },
            security: [{ simple: [] }],
        },
    },
    {
        plugin: Good,
        options: {
            reporters: {
                consoleReporter: [{
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{ log: '*', response: '*', error: '*' }],
                }, {
                    module: 'good-console',
                }, 'stdout'],
            },
        },
    },
];

// Looks like Confidence does not work with objects anymore. Need to do this manually
if (process.env.NODE_ENV !== 'test') {
    plugins = plugins.concat(HapiSwaggerDependencies);
}

const config = {
    server: {
        debug: false,
        port: {
            $filter: 'env',
            test: 0,
            $default: '$env.PORT',
        },
        app: {
            db: {
                url: {
                    $filter: 'env',
                    test: 'sqlite:///tmp/profiles_test_db',
                    $default: '$env.DB_URL',
                },
                options: {
                    logging: {
                        $filter: 'env',
                        test: false,
                        development: true,
                        $default: false,
                    },
                },
            },
        },
    },
    register: {
        plugins,
    },
};

const store = new Confidence.Store();
store.load(config);
const appManifest = store.get('/', {
    env: process.env.NODE_ENV,
});

// This makes sure that nodemon restart the app properly
process.on('SIGUSR2', () => { process.exit(0); });

module.exports = appManifest;
