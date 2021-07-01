const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:e3de2cd65c8241ac960a59fcfa5bb672@localhost:5432/Vibe-Check');

module.exports = sequelize;