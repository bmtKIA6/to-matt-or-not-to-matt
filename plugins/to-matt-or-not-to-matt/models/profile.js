

const initModel = (sequelize, DataTypes) => {
    const Profile = sequelize.define('Profile', {
        id: {
            type: DataTypes.STRING,
            field: 'id',
            primaryKey: true,
        },
        slug: {
            type: DataTypes.STRING,
            field: 'slug',
            allowNull: false,
        },
        jobTitle: {
            type: DataTypes.STRING,
            field: 'job_title',
            allowNull: true,
        },
        firstName: {
            type: DataTypes.STRING,
            field: 'first_name',
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            field: 'last_name',
            allowNull: false,
        },
        fullName: {
            type: DataTypes.VIRTUAL,
            get() {
                return [this.getDataValue('firstName'), this.getDataValue('lastName')].join(' ');
            },
        },
        headshot_url: {
            type: DataTypes.STRING(1024),
            field: 'headshot_url',
        },
    }, {
        tableName: 'profiles',
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
        paranoid: true,
    });

    return Profile;
};

module.exports = initModel;
