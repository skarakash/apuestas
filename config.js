const Sequelize = require('sequelize');

const sequelize = new Sequelize('uh1107264_c', 'uh1107264', 'Aw@19962004', {
    host: '93.190.46.16',
    dialect: 'mysql',
    port: 3306
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.'); // eslint-disable-line no-console
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err); // eslint-disable-line no-console
    });

const token = '9592-4fLZMMQS4YDdoY';

module.exports = {
    sequelize,
    token
};