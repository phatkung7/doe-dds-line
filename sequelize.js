const { Sequelize } = require("sequelize");
require("dotenv").config(); // Load environment variables from .env

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    timezone: "+07:00", // Set the timezone to Asia/Bangkok
  }
);

module.exports = sequelize;
