const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("sequelize");
//const Usersso = require("./models/usersso");
const { User, Refdisease } = require("./models/user");
const Events = require("./models/event");
const { sendEmail } = require("./emailSender");
const e = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
//var qs = require("qs");
//Line API
const line = require("./util/line.util");
// ref position 
const {  RefPosition, RefSection, Users, UsersDetail, ModelHasRoles, ModelHasSection  } =  require("./models/doesarabun")
//Line Notify
//const lineNotify = require("line-notify-nodejs")(process.env.LINE_NOTIFY);

const app = express();
const port = 3333;
// const port = 3000;
app.use(cors());

// Middleware to parse JSON
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  res.status(200).json({ data: "Hello I'm API From DDDC Thailand" });
});
// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});
app.post("/events-response", async (req, res) => {
  const { EventID, NotifyID, idTokenLine, ActionID } = req.body;
  console.log(`EventID : ${EventID} ,NotifyID : ${NotifyID} ,idTokenLine : ${idTokenLine} ,ActionID : ${ActionID}`);
  if (!EventID || !NotifyID || !idTokenLine || !ActionID) {
    return res
      .status(404)
      .json({ error: "EventID,NotifyID,idTokenLine is required" });
  } else {
    console.log(`idTokenLine : ${idTokenLine}`);
    const profile_decode = await line.verifyIDToken(idTokenLine);
    // Get userId Profile
    const userId = profile_decode?.sub;
    try {
      const user = await User.findOne({ where: { user_id_line: userId } });
      if (user) {
        Events.create({
          user_id_line: userId,
          hospcode: user.hospcode,
          username: user.username,
          event_id: EventID,
          notify_id: NotifyID,
          action_id: ActionID,
          created_at: new Date(),
        });
      } else {
        console.log("User not found");
        return res
          .status(404)
          .json({ error: "ไม่พบผู้ใช้งานจากการค้นหาด้วย userId" });
      }
    } catch (error) {
      console.error(`Error Find By userId: ${idTokenLine}`, error);
    }
    //res.status(200).json({ data: decodedPayload.payload, status: "success" });
    res.status(200).json({ status: "success" });
  }
});
app.get("/ref_disease", async (req, res) => {
  // res.status(200).json({ status: "OK" });
  const ref_disease = await Refdisease.findAll();
  res.status(200).json({ status: "OK",data: ref_disease });
  console.log(ref_disease);
});
app.post("/check-user-moph-ic-v2", async (req, res) => {
  const { hospcode, password, username, idTokenLine, LineType, LineTypeDesc } =
    req.body;
  if (!username || !hospcode || !password || !idTokenLine || !LineType) {
    return res
      .status(404)
      .json({ error: "username,hospcode,idTokenLine,LineType is required" });
  }
  console.log(`idTokenLine : ${idTokenLine}`);
  //Line Decode Token
  //const profile_decode = await LineVerifyIDToken(idTokenLine);
  const profile_decode = await line.verifyIDToken(idTokenLine);
  // Get Profile
  const userId = profile_decode?.sub;
  if (userId) {
    console.log(`UserId : ${userId}`);
    // Create HMAC-SHA256 hash
    const hmac = crypto.createHmac("sha256", process.env.MOPHIC_SECRETKEY);
    hmac.update(password);
    const hash = hmac.digest("hex");
    const password_encrypt = hash.toUpperCase();
    // Option 1: Append parameters to the URL
    const urlWithParameters = `${process.env.MOPHIC_ENDPOINT_AUTH}&user=${username}&password_hash=${password_encrypt}&hospital_code=${hospcode}`;
    axios
      .post(urlWithParameters)
      .then((response) => {
        console.log(`GET Decode the JWT payload`);
        // Decode the JWT payload
        const decodedPayload = jwt.decode(response.data, { complete: true });
        const moph_hospcode = decodedPayload.payload.client.hospital_code;
        const moph_username = decodedPayload.payload.client.login;
        if (moph_hospcode || moph_username || userId) {
          User.create({
            hospcode: moph_hospcode,
            username: moph_username,
            user_id_line: userId,
            line_type: LineType,
            line_description: LineTypeDesc,
            id_disease: refdisease,
            created_at: new Date(),
            status: "active",
          });
          //Set Rich Menu By userId
          line.linkRichMenu(userId, process.env.RICHMENU_SERVICE);
        }
        //res.status(200).json({ data: decodedPayload.payload, status: "success" });
        res.status(200).json({ status: "success" });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "ไม่พบผู้ใช้งาน MOPHIC" });
      });
  } else {
    console.error("The 'sub' property is missing in the decoded profile.");
    res.status(500).json({ status: "Can't Get userId" });
    // Handle the error or take appropriate action
  }
});
// DOE-Sarabun Session------------------------------------------------------------------------------------
//doe-sarabun-register
//ref position
app.get("/ref-position", async (req, res) => {
  //res.status(200).json({ status: "OK" });
  const ref_position = await RefPosition.findAll();
  res.status(200).json({ status: "OK",data: ref_position });
  console.log(ref_position);
});
//ref section
app.get("/ref-section", async (req, res) => {
  //res.status(200).json({ status: "OK" });
  const ref_section = await RefSection.findAll();
  res.status(200).json({ status: "OK",data: ref_section });
  //console.log(ref_section);
});

// insert data to 201
app.post("/doe-sarabun-register", async (req, res) => {
  const {  idTokenLine, email, title_name, first_name, last_name, password, position_id, section_id, tel } = req.body;
  // แสดงข้อมูลที่ถูกส่งมา (request body)
  console.log("Request Body:", req.body);

  if ( !idTokenLine ) {
    return res
      .status(404)
      .json({ error: "idTokenLine is required" });
  } else{    
      // console.log(`idTokenLine : ${idTokenLine}`);
      const profile_decode = await line.verifyIDToken(idTokenLine);
      const userId = profile_decode?.sub;
      const lineName = profile_decode?.name;
      try {
        const user = await Users.findOne({ where: { email: email } });
        if (user) {
          console.log("ไปอัพเดทนะพ่อหนุ่ม");
          try {
            // ค้นหา user จากตาราง Users โดยใช้ email
            const user_id = await Users.findOne({ where: { email: email } });
            // console.log("ได้ id:", user.id);
            // console.log("ได้ userId:", userId);
            // console.log("ได้ userId:", lineName);
            // อัปเดตตาราง users_detail
            await UsersDetail.update(
              {
                line_name: lineName,
                line_token: userId,
                updated_at: Date.now()
              },
              {
                where: {
                  user_id: user_id.id,
                },
              }
            );
            console.log("อัปเดตข้อมูลสำเร็จ");
            // ส่งข้อมูลกลับ
            res.status(200).json({ status: "success" })
            } catch (error) {
              console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล:", error);
              return res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล", message: error.message }); // ส่ง error message กลับไปด้วย
            }
        } else {
          console.log("มาเพิ่มใหม่นะพ่อหนุ่ม");
          try {
            // เพิ่มข้อมูลใหม่ลงในตาราง Users
            const newUser = await Users.create({
              name:  first_name + " " + last_name, 
              email: email,
              password: password, 
              created_at: Date.now()

            });
        
            // เพิ่มข้อมูลใหม่ลงในตาราง UsersDetail
            await UsersDetail.create({
              user_id: newUser.id, // ใช้ ID จากผู้ใช้ที่เพิ่งสร้าง
              title_name: title_name,
              first_name: first_name,
              last_name: last_name,
              position_id: position_id,
              section_id: section_id,
              tel: tel,
              line_name: lineName,
              line_token: userId,
              created_at: Date.now(),
              sub_section_id: "0",

            });
        
            // เพิ่มข้อมูลใหม่ลงในตาราง ModelHasSection
            await ModelHasSection.create({
              user_id: newUser.id,
              section_id: section_id,
              sub_section_id: "0",
              created_at: Date.now(),
            });
            // เพิ่มข้อมูลใหม่ลงในตาราง ModelHasRoles
            const model_type = `App\\Models\\User`;
            await ModelHasRoles.create({
              role_id: "5",
              model_type: model_type,
              model_id: newUser.id,      
            },
            { raw: true });
            console.log("อัปเดตข้อมูลสำเร็จ");
            // ส่งข้อมูลกลับ
            res.status(200).json({ status: "success" })
            } catch (error) {
              console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล:", error);
              return res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" }); // เพิ่ม return ใน catch block
            }
        }
      } catch (error) {
        console.error(`Error Find By userId: ${idTokenLine}`, error);
      }
  }

});

// DOE-Sarabun Session------------------------------------------------------------------------------------
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

// Handle closing the Sequelize connection when the app is terminated
process.on("SIGINT", async () => {
  await sequelize.close();
  process.exit();
});
