// user.js
const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const User = sequelize.define(
  "User",
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
      type: DataTypes.STRING,
      allowNull: false,
      comment: "รหัสสถานพยาบาล",
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: "ชื่อใช้ login moph-id",
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active", // Default to 'active' if not provided
      comment: "สถานะของผู้ใช้งาน",
    },
  },
  {
    tableName: "users_sso", // You can customize the table name if needed
    timestamps: true, // Set to true if you want createdAt and updatedAt fields
  }
);

//This will create the "users" table in your database
// User.sync({ force: false }).then(() => {
//   console.log("User table synced");
// });
module.exports = User;
