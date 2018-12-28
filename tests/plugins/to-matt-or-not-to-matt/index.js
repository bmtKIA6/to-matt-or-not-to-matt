
const Code = require('code');
const Lab = require('lab');
const Wreck = require('wreck');
const Glue = require('glue');

const {
    experiment, test, before, afterEach,
} = exports.lab = Lab.script();

const { expect } = Code;

const Models = require('../../../plugins/to-matt-or-not-to-matt/models');
const Manifest = require('../../../config/manifest');
const MattPlugin = require('../../../plugins/to-matt-or-not-to-matt/index');

const wreckGetOrig = Wreck.get;

let server;

before(async () => {
    const options = {
        relativeTo: `${__dirname}/../../..`,
    };

    // load server
    server = await Glue.compose(Manifest, options);
    await server.start();
});

experiment('To Matt Or Not To Matt - index', () => {
    afterEach(() => {
        Wreck.get = wreckGetOrig;
    });

    test('should validate the user', async () => {
        const testUser = 'user1';
        const testPassword = 'password1';

        const auth = await MattPlugin.validateUser({}, testUser, testPassword);

        expect(auth).to.be.an.object();
        expect(auth.isValid).to.be.true();
        expect(auth.credentials.id).to.equal(testUser);
        expect(auth.credentials.name).to.equal(testUser);
    });

    test('should populate DB with profile data', async () => {
        const testUrl = 'http://some.domain/api/profiles';
        const testResponse = { statusCode: 200 };
        const testProfiles = [{
            id: '4NCJTL13UkK0qEIAAcg4IQ',
            type: 'people',
            slug: 'joel-garrett',
            jobTitle: 'Senior Software Engineer',
            firstName: 'Joel',
            lastName: 'Garrett',
            headshot: {
                type: 'image', mimeType: 'image/jpeg', id: '4Mv2CONANym46UwuuCIgK', url: '//images.ctfassets.net/3cttzl4i3k1h/4Mv2CONANym46UwuuCIgK/cbeb43c93a843a43c07b1de9954795e2/headshot_joel_garrett.jpg', alt: 'headshot joel garrett', height: 340, width: 340,
            },
            socialLinks: [],
        },
        ];
        // const testProfileIds = testProfiles.map(profile => profile.id);

        //        const findOrCreateOrig = Models.Profile.findOrCreate;

        Wreck.get = async () => Promise.resolve({
            res: testResponse,
            payload: testProfiles,
        });

        // Models.Profile.findOrCreate = (opts) => {

        //             expect(1).to.equal(3);

        //     console.log('got the opts', opts.defaults.jobTitle);
        //     expect(testProfileIds).to.include(opts.where.id);
        //     expect(opts.defaults.id).to.equal(testProfiles[0].id);
        //     expect(opts.defaults.lastName).to.equal(testProfiles[0].lastName);
        //     expect(opts.defaults.firstName).to.equal(testProfiles[0].firstName);
        //     expect(opts.defaults.jobTitle).to.equal(testProfiles[0].jobTitle);
        //     expect(opts.defaults.jobTitle).to.equal(testProfiles[0].slug);

        //     //Models.Profile.findOrCreate = findOrCreateOrig;
        // };

        MattPlugin.populateDB(server, testUrl);

        return Models.Profile.findByPk(testProfiles[0].id)
            .then((profile) => {
                expect(profile.id).to.be.equal(testProfiles[0].id);
            });
    });
});
