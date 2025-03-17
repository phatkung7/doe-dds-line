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
//ฟังก์ชั่นเรียกตรวจสอบuser
const Users = sequelize.define(
  "Users",
  {
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },

  },
  {
    tableName: "users", // You can customize the table name if needed
    timestamps: false,
    //timestamps: true, // Set to true if you want createdAt and updatedAt fields
  }
);
//ฟังก์ชั่นเรียกตรวจสอบUsersDetail
const UsersDetail = sequelize.define(
  "UsersDetail",
  {
    email: {
      type: DataTypes.STRING,
    },
    user_id: {
      type: DataTypes.STRING,
    },
    title_name: {
      type: DataTypes.STRING,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    position_id: {
      type: DataTypes.STRING,
    },
    section_id: {
      type: DataTypes.STRING,
    },
    tel: {
      type: DataTypes.STRING,
    },
    line_name: {
      type: DataTypes.STRING,
    },
    line_token: {
      type: DataTypes.STRING,
    },
    sub_section_id: {
      type: DataTypes.STRING,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "users_detail", // You can customize the table name if needed
    timestamps: false,
    //timestamps: true, // Set to true if you want createdAt and updatedAt fields
  }
);
//ฟังก์ชั่นเรียกตรวจสอบmodel_has_roles
const ModelHasRoles = sequelize.define(
  "ModelHasRoles",
  {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    model_type: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    model_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    tableName: "model_has_roles",
    timestamps: false,
  }
);
//ฟังก์ชั่นเรียกตรวจสอบmodel_has_Section
const ModelHasSection = sequelize.define(
  "ModelHasSection",
  {
    role_id: {
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    section_id: {
      type: DataTypes.INTEGER,
    },
    sub_section_id: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      type: DataTypes.DATE,
    },

  },
  {
    tableName: "model_has_section", // You can customize the table name if needed
    timestamps: false,
    //timestamps: true, // Set to true if you want createdAt and updatedAt fields
  }
);
//This will create the "users" table in your database
// User.sync({ force: false }).then(() => {
//   console.log("User table synced");
// });
module.exports = { RefPosition, RefSection, Users, UsersDetail, ModelHasRoles, ModelHasSection };
