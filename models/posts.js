const { DataTypes } = require('sequelize');
const db = require('../db');

const Posts = db.define('posts', {
    title: {
        type: DataTypes.STRING,
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
        type: DataTypes.STRING,
        allowNull: false
    },
    owner: {
        type: DataTypes.INTEGER
    }
});

module.exports = Posts;