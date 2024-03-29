const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("sequelize");
//const Usersso = require("./models/usersso");
const User = require("./models/user");
const { sendEmail } = require("./emailSender");
const e = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
var qs = require("qs");
//Line API
const line = require("./util/line.util");
//Line API
//const MessagingApiClient = require("@line/bot-sdk").messagingApi.MessagingApiClient;
//Line Notify
//const lineNotify = require("line-notify-nodejs")(process.env.LINE_NOTIFY);

const app = express();
const port = 3000;
app.use(cors());

// Middleware to parse JSON
app.use(bodyParser.json());

// const LineVerifyIDToken = async (idToken) => {
//   const params = new URLSearchParams();
//   params.append("id_token", idToken);
//   params.append("client_id", process.env.LIFF_CHANNEL_ID);
//   console.log(`========= LIFF_CHANNEL_ID : ${process.env.LIFF_CHANNEL_ID}`);
//   const headers = {
//     "Content-Type": "application/x-www-form-urlencoded",
//   };

//   try {
//     const response = await axios.post(
//       "https://api.line.me/oauth2/v2.1/verify",
//       params,
//       { headers }
//     );

//     // Assuming the response contains the decoded data
//     return response.data;
//   } catch (error) {
//     console.error("Error verifying Line ID token:", error);
//     //throw error;
//   }
// };

const issueTokenV3 = async () => {
  let data = qs.stringify({
    grant_type: "client_credentials",
    client_id: process.env.LINE_CHANNEL_ID,
    client_secret: process.env.LINE_CHANNEL_SECRET,
  });
  let response = await axios({
    method: "post",
    maxBodyLength: Infinity,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    url: "https://api.line.me/oauth2/v3/token",
    data: data,
  });
  return response.data;
};

const linkRichMenu = async (userId, richMenuId) => {
  const issue_token = await issueTokenV3();
  const access_token = issue_token.access_token;

  return axios({
    method: "post",
    url: `${process.env.LINE_MESSAGING_API}/user/${userId}/richmenu/${richMenuId}`,
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });
};

app.get("/", async (req, res) => {
  res.status(200).json({ data: "Hello I'm API From DDDC Thailand" });
});
// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// app.get("/chk", async (req, res) => {
//   const idTokenLine =
//     "eyJraWQiOiIyNmNmMzk1ZjQ4MTYyZTRhMzc3MzM5Yjk1MjBjNzA2NzI5ZTFmZGMzYTY0NWI3YTlhZTc3YWMyYTQ4NzVhODA4IiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2FjY2Vzcy5saW5lLm1lIiwic3ViIjoiVTUxMjUwYjliMGM2NDA1ZTJiZTMxMDk1NGQ5NmM5ODg3IiwiYXVkIjoiMjAwMzU1NDkyMyIsImV4cCI6MTcxMDMxNTY5MiwiaWF0IjoxNzEwMzEyMDkyLCJhbXIiOlsibGluZXFyIl0sIm5hbWUiOiJQb29QZWF3IiwicGljdHVyZSI6Imh0dHBzOi8vcHJvZmlsZS5saW5lLXNjZG4ubmV0LzBoRkdjTWpraFRHV2hlTkF6RTVHeG1QMkp4RndVcEdoOGdKZ0JWV1NnMkYxeHpWMTA3WmdWWFhIazNSVjBrVUFvX01sVldDU3RtVGdwMiJ9.oKGYQl5v1Ph0Sv2p3aebw1SMZxAIpdNk-v-kKIwovLSOGkSxJg-GIDHK4HFSs1A-T_EUeeoyZO1eIK5WIIMHsg";
//   const profile_decode = await LineVerifyIDToken(idTokenLine);
//   const tokenVerify = await line.verifyIDToken(token);
//   console.log(`profile_decode : ${profile_decode.sub}`);
// });

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
app.post("/check-user-moph-ic-v2", async (req, res) => {
  const { hospcode, password, username, idTokenLine } = req.body;
  if (!username || !hospcode || !password || !idTokenLine) {
    return res
      .status(404)
      .json({ error: "username,hospcode,idTokenLine is required" });
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
