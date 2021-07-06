const { DataTypes } = require('sequelize');
const db = require('../db');

const User = db.define('user', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    birthday: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    about: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    zodiac: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

module.exports = User;