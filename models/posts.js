const { DataTypes } = require('sequelize');
const db = require('../db');

const Posts = db.define('posts', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sign: {
        type: DataTypes.STRING,
        allowNull: false
    },
    entry: {
        type: DataTypes.TEXT,
        allowNull: false
    }
    // owner: {
    //     type: DataTypes.INTEGER,
    // }
});

module.exports = Posts;