const Sequelize = require('sequelize');
const { sequelize } = require('../config');

const Bet = sequelize.define('bets', {
    league_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    teams: {
        type: Sequelize.STRING,
        allowNull: false
    },
    match_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    over_od: {
        type: Sequelize.STRING,
        allowNull: false
    },
    under_od: {
        type: Sequelize.STRING,
        allowNull: false
    },
    total: {
        type: Sequelize.STRING,
        allowNull: false
    },
    probab: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    won_lost: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
}, {
    freezeTableName: true,
    timestamps: false,
});


module.exports = Bet;