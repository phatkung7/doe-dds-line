const { Sequelize } = require("sequelize");
require("dotenv").config(); // Load environment variables from .env

const sequelize201 = new Sequelize(
  process.env.DB_NAME_201,
  process.env.DB_USER_201,
  process.env.DB_PASSWORD_201,
  {
    host: process.env.DB_HOST_201,
    dialect: "mysql",
    timezone: "+07:00", // Set the timezone to Asia/Bangkok
  }
);

module.exports = sequelize201;
