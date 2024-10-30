const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Event = require('./Event')


// Define WaitingList model
const WaitingList = sequelize.define('WaitingList', {
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Event,
            key: 'id'
        }
    }
}, {
    timestamps: true,
});


module.exports = WaitingList;