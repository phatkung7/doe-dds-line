// user.js
const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
//ฟังก์ชั่นเรียกโรค
const Refdisease = sequelize.define(
  "Refdisease",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_disease: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: "รหัสโรค",
    },
    disease_name: {
      type: DataTypes.STRING,
    },
    full_disease_th: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    disease_th: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    disease_gr: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "กลุ่มโรค",
    },
  },
  {
    tableName: "ref_disease", // ระบุชื่อตารางให้ตรงกับฐานข้อมูล
    timestamps: false, // ปิดการใช้ createdAt / updatedAt
  }
);
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
      allowNull: false,
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
    line_type: {
      type: DataTypes.STRING(1),
      allowNull: false,
      comment: "ประเภทของ Line(ส่วนตัว,ส่วนกลาง)",
    },
    line_description: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      comment: "ชื่อกลุ่มงาน/หน่วยงาน",
    },
    id_disease: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      comment: "โรคที่รับผิดชอบ",
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active", // Default to 'active' if not provided
      comment: "สถานะของผู้ใช้งาน",
    },
  },
  {
    tableName: "users", // You can customize the table name if needed
    timestamps: true, // Set to true if you want createdAt and updatedAt fields
  }
);

//This will create the "users" table in your database
// User.sync({ force: false }).then(() => {
//   console.log("User table synced");
// });
module.exports = { User, Refdisease };
