const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("sequelize");
//const Usersso = require("./models/usersso");
const User = require("./models/user");
const Events = require("./models/event");
const { sendEmail } = require("./emailSender");
const e = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
//var qs = require("qs");
//Line API
const line = require("./util/line.util");
//Line Notify
//const lineNotify = require("line-notify-nodejs")(process.env.LINE_NOTIFY);

const app = express();
const port = 3000;
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

// app.post("/check-user-moph-ic-v1", async (req, res) => {
//   //req.setHeader("Access-Control-Allow-Origin", "*");
//   const { hospcode, password, username, idTokenLine } = req.body;
//   if (!username) {
//     return res.status(404).json({ error: "username is required" });
//   }
//   //check user on PDSA
//   const user_pdsa = await Usersso.findByUserPDSA(username);
//   if (user_pdsa) {
//     // Create HMAC-SHA256 hash
//     const hmac = crypto.createHmac("sha256", process.env.MOPHIC_SECRETKEY);
//     hmac.update(password);
//     const hash = hmac.digest("hex");
//     const password_encrypt = hash.toUpperCase();
//     // Option 1: Append parameters to the URL
//     const urlWithParameters = `${process.env.MOPHIC_ENDPOINT_AUTH}&user=${username}&password_hash=${password_encrypt}&hospital_code=${hospcode}`;
//     axios
//       .post(urlWithParameters)
//       .then((response) => {
//         // Decode the JWT payload
//         const decodedPayload = jwt.decode(response.data, { complete: true });
//         res.status(200).json({ data: decodedPayload });
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   } else {
//     res.status(400).json({ error: `user : ${username} not found` });
//   }
// });

// app.get("/events-response", async (req, res) => {
//   const { EventID, NotifyID, idTokenLine, ActionID } = req.body;
//   if (!EventID || !NotifyID || !idTokenLine || !ActionID) {
//     return res
//       .status(404)
//       .json({ error: "EventID,NotifyID,idTokenLine is required" });
//   } else {
//     console.log(`idTokenLine : ${idTokenLine}`);
//     const profile_decode = await line.verifyIDToken(idTokenLine);
//     // Get userId Profile
//     const userId = profile_decode?.sub;
//     try {
//       const user = await User.findOne({ where: { user_id_line: userId } });
//       if (user) {
//         Events.create({
//           user_id_line: userId,
//           hospcode: user.hospcode,
//           username: user.username,
//           event_id: EventID,
//           notify_id: NotifyID,
//           action_id: ActionID,
//           created_at: new Date(),
//         });
//       } else {
//         console.log("User not found");
//         return res
//           .status(404)
//           .json({ error: "ไม่พบผู้ใช้งานจากการค้นหาด้วย userId" });
//       }
//     } catch (error) {
//       console.error(`Error Find By userId: ${idTokenLine}`, error);
//     }
//   }
// });

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

// Handle closing the Sequelize connection when the app is terminated
process.on("SIGINT", async () => {
  await sequelize.close();
  process.exit();
});
