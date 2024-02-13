const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Survey = sequelize.define(
  "Survey",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ticket_number: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: true,
      comment: "รหัส Ticket",
    },
    score: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "คะแนนการประเมินความพึงพอใจ",
    },
    user_id_line: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "userId ของไลน์ในแต่ละ Provider",
    },
  },
  {
    tableName: "survey", // Specify the table name if you want to customize it
    timestamps: true, // Set to true if you want Sequelize to manage createdAt and updatedAt fields
  }
);
//This will create the "Survey" table in your database
// Survey.sync({ force: false }).then(() => {
//   console.log("Survey table synced");
// });
module.exports = Survey;
