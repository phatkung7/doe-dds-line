// user.js
const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Events = sequelize.define(
  "Events",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id_line: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      comment: "userId ของไลน์ในแต่ละ Provider",
    },
    hospcode: {
      type: DataTypes.STRING(5),
      allowNull: false,
      comment: "รหัสสถานพยาบาล",
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: "ชื่อใช้ login moph-id",
    },
    event_id: {
      type: DataTypes.STRING(5),
      allowNull: true,
      comment: "userId ของไลน์ในแต่ละ Provider",
    },
    notify_id: {
      type: DataTypes.STRING(5),
      allowNull: true,
      comment: "userId ของไลน์ในแต่ละ Provider",
    },
    action_id: {
      type: DataTypes.STRING(5),
      allowNull: false,
      comment: "การตอบสนองต่อ Events",
    },
  },
  {
    tableName: "events", // You can customize the table name if needed
    timestamps: true, // Set to true if you want createdAt and updatedAt fields
  }
);

//This will create the "users" table in your database
// Events.sync({ force: false }).then(() => {
//   console.log("Events table synced");
// });
module.exports = Events;
