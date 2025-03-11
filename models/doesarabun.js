const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize201");
//ฟังก์ชั่นเรียกตำแหน่ง
const RefPosition = sequelize.define(
    "RefPosition",
    {
      position_name: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "ref_position", // You can customize the table name if needed
      timestamps: false,
      //timestamps: true, // Set to true if you want createdAt and updatedAt fields
    }
  );
//ฟังก์ชั่นเรียกกลุ่ม
const RefSection = sequelize.define(
    "RefSection",
    {
      section_name_th: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "ref_section", // You can customize the table name if needed
      timestamps: false,
      //timestamps: true, // Set to true if you want createdAt and updatedAt fields
    }
  );
//This will create the "users" table in your database
// User.sync({ force: false }).then(() => {
//   console.log("User table synced");
// });
module.exports = { RefPosition, RefSection };
