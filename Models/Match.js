const Sequelize = require('sequelize');
const { sequelize } = require('../config');

const Match = sequelize.define('handball', {
    tournament: {
        type: Sequelize.STRING,
        allowNull: false
    },
    season: {
        type: Sequelize.STRING,
        allowNull: false
    },
    teams: {
        type: Sequelize.STRING,
        allowNull: false
    },
    HT: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    '@35': {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    '@40': {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    '@45': {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    '@50': {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    '@55': {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    'FT': {
        type: Sequelize.INTEGER,
        allowNull: false
    },
}, {
    freezeTableName: true,
    timestamps: false,
});


module.exports = Match;