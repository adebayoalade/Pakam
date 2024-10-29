const { DataTypes} = require('sequelize');
const sequelize = require('../config/database');


// Define Event model
const Event = sequelize.define('Event', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    totalTickets: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    availableTickets: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
});


module.exports = Event;