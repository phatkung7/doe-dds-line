// user_otp.js
const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const UserOTP = sequelize.define(
  "UserOTP",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
      comment: "Email บน DDC-SSO",
    },
    otp_code: {
      type: DataTypes.STRING,
      comment: "OTP Code",
    },
  },
  {
    tableName: "users_otp", // You can customize the table name if needed
    timestamps: true, // Set to true if you want createdAt and updatedAt fields
  }
);

// This will create the "users" table in your database
// UserOTP.sync({ force: false }).then(() => {
//   console.log("UserOTP table synced");
// });

module.exports = UserOTP;
