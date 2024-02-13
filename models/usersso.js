// user.js
const { DataTypes, Op } = require("sequelize");
//const sequelize_external = require("../sequelize-external");
const sequelize = require("../sequelize");

const Usersso = sequelize.define(
  "Usersso",
  {
    user_moph: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "pdsa_list", // You can customize the table name if needed
    //timestamps: true, // Set to true if you want createdAt and updatedAt fields
  }
);

Usersso.findByUserPDSA = async function (
  user_pdsa,
  attributes = ["name", "hospcode", "office"]
) {
  return await Usersso.findOne({
    attributes: attributes,
    where: {
      user_moph: user_pdsa,
      // status: {
      //   [Op.and]: [
      //     { [Op.eq]: 1 }, // status_id = 1
      //     { [Op.not]: null }, // status_id is not null
      //   ],
      // },
    },
  });
};

module.exports = Usersso;
