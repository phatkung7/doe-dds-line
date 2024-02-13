const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize"); // Assuming you have a Sequelize instance

const SysType = sequelize.define(
  "SysType",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sys_name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      comment: "ชื่อระบบ",
    },
    sys_url: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "รหัสระบบ DDC4.0",
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: false,
      defaultValue: "Active", // Default to 'active' if not provided
      comment: "สถานะการใช้งาน",
    },
  },
  {
    tableName: "sys_types", // Specify the table name if you want to customize it
    timestamps: false, // Set to true if you want Sequelize to manage createdAt and updatedAt fields
  }
);
// This will create the "SysType" table in your database
// SysType.sync({ force: false }).then(() => {
//   console.log("SysType table synced");
// });
module.exports = SysType;
