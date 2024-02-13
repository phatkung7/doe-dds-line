const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize"); // Assuming you have a Sequelize instance
const SysType = require("./sys_type");
const Ticket = sequelize.define(
  "Ticket",
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
    sys_type: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      comment: "รหัสระบบ DDC4.0",
    },
    issue_detail: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "รายละเอียดของปัญหา",
    },
    issue_picture: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "(ภาพ)รายละเอียดของปัญหา",
    },
    reporter: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "ผู้แจ้งปัญหา",
    },
    reporter_tel: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "เบอร์โทรผู้แจ้งปัญหา",
    },
    reporter_userId: {
      type: DataTypes.STRING(50), // Adjust the data type and size as needed
      allowNull: true,
      comment: "UUID Line",
    },
    recipient: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "ผู้รับแจ้งปัญหา",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "วันที่สร้างเคส",
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "วันที่อัพเดทเคส",
    },
    received_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "วันที่รับเคส",
    },
    finished_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "วันที่ปิดเคส",
    },
    ticketStatus: {
      type: DataTypes.ENUM("Waiting", "Processing", "Finish"),
      allowNull: false,
      defaultValue: "Waiting", // Default to 'active' if not provided
      comment: "สถานะการดำเนินการ",
    },
    knowledge: {
      type: DataTypes.TEXT,
      comment: "วิธีแก้ไขปัญหา",
    },
  },
  {
    tableName: "tickets", // Specify the table name if you want to customize it
    timestamps: false, // Set to true if you want Sequelize to manage createdAt and updatedAt fields
  }
);
// This will create the "Ticket" table in your database
// Ticket.sync({ force: false }).then(() => {
//   console.log("Ticket table synced");
// });
/* Importain !!!! Please CREATE TRIGGER */
// CREATE TRIGGER tickets_before_insert
//         BEFORE INSERT ON tickets
//         FOR EACH ROW
//         SET NEW.ticket_number = CONCAT('TK-', LPAD((SELECT IFNULL(MAX(SUBSTRING(ticket_number, 6)) + 1, 1) FROM tickets), 6, '0'));
Ticket.belongsTo(SysType, { foreignKey: "sys_type" });
module.exports = Ticket;
