

const internals = {};

internals.Type = {
    GUESS_6: 'guess_6',
};

const initModel = (sequelize, DataTypes) => {
    const Gameplay = sequelize.define('Gameplay', {
        id: {
            type: DataTypes.INTEGER,
            field: 'id',
            primaryKey: true,
            autoIncrement: true,
        },
        session: {
            type: DataTypes.STRING,
            field: 'session',
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM,
            field: 'type',
            allowNull: false,
            values: Object.keys(internals.Type).map(key => internals.Type[key]),
        },
        score: {
            type: DataTypes.STRING,
            field: 'score',
            allowNull: false,
            defaultValue: 0,
        },
        tries: {
            type: DataTypes.INTEGER,
            field: 'tries',
            allowNull: false,
            defaultValue: 0,
        },
    }, {
        tableName: 'gameplays',
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
        paranoid: true,
    });

    Gameplay.Type = internals.Type;

    return Gameplay;
};

module.exports = initModel;
