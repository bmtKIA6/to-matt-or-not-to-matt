/**
   This file exposes all the models in the current folder and exports all of these,
   together with the sequlize instance
*/
const Fs = require('fs');
const Path = require('path');
const Sequelize = require('sequelize');
const Manifest = require('../../../config/manifest');

const sequelize = new Sequelize(Manifest.server.app.db.url,
    Manifest.server.app.db.options);

const db = {};

Fs
    .readdirSync(__dirname)
    .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
    .forEach((file) => {
        const model = sequelize.import(Path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;
