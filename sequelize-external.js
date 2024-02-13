// sequelize-external.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelizeExternal = new Sequelize(
  process.env.DB_NAME_PDSA,
  process.env.DB_USER_PDSA,
  process.env.DB_PASSWORD_PDSA,
  {
    host: process.env.DB_HOST_PDSA,
    dialect: "mysql",
    timezone: "+07:00", // Set the timezone to Asia/Bangkok
  }
);

module.exports = sequelizeExternal;
