const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("./emailSender");
const { User } = require("./models/user"); // Assuming the model is correctly exported from "./models"
const sequelize = require("sequelize");
const qs = require("qs");

const app = express();
const port = 3000;

// CORS middleware
//app.use(cors());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// Middleware to parse JSON
app.use(bodyParser.json());

const LineVerifyIDToken = async (idToken) => {
  // const params = new URLSearchParams();
  // params.append("id_token", idToken);
  // params.append("client_id", process.env.LIFF_CHANNEL_ID);
  let data = qs.stringify({
    id_token: idToken,
    client_id: process.env.LIFF_CHANNEL_ID,
  });

  try {
    const response = await axios.post(
      "https://api.line.me/oauth2/v2.1/verify",
      data,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    // Assuming the response contains the decoded data
    return response.data;
  } catch (error) {
    console.error("Error verifying Line ID token:", error);
    throw error; // Rethrow the error to handle it in the calling function if needed
  }
};

const issueTokenV3 = async () => {
  const data = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.LINE_CHANNEL_ID_MSG,
    client_secret: process.env.LINE_CHANNEL_SECRET,
  });

  try {
    const response = await axios.post(
      "https://api.line.me/oauth2/v3/token",
      data,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error issuing Line Messaging API token:", error);
    throw error;
  }
};

const linkRichMenu = async (userId, richMenuId) => {
  try {
    const issueTokenResponse = await issueTokenV3();
    const accessToken = issueTokenResponse.access_token;

    await axios.post(
      `${process.env.LINE_MESSAGING_API}/user/${userId}/richmenu/${richMenuId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`Linked rich menu for userId: ${userId}`);
  } catch (error) {
    console.error("Error linking rich menu:", error);
    throw error;
  }
};

app.get("/", (req, res) => {
  res.status(200).json({ data: "Hello, I'm API from DDDC Thailand" });
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.post("/check-user-moph-ic-v2", async (req, res) => {
  const { hospcode, password, username, idTokenLine } = req.body;

  if (!username || !hospcode || !password || !idTokenLine) {
    return res
      .status(400)
      .json({ error: "username, hospcode, idTokenLine are required" });
  }

  try {
    const profileDecode = await LineVerifyIDToken(idTokenLine);
    const userId = profileDecode?.sub;

    if (userId) {
      console.log(`UserId: ${userId}`);

      const hmac = crypto.createHmac("sha256", process.env.MOPHIC_SECRETKEY);
      hmac.update(password);
      const passwordEncrypt = hmac.digest("hex").toUpperCase();

      const urlWithParameters = `${process.env.MOPHIC_ENDPOINT_AUTH}&user=${username}&password_hash=${passwordEncrypt}&hospital_code=${hospcode}`;

      const response = await axios.post(urlWithParameters);
      const decodedPayload = jwt.decode(response.data, { complete: true });

      const { hospital_code: mophHospcode, login: mophUsername } =
        decodedPayload.payload.client;

      if (mophHospcode || mophUsername || userId) {
        await User.create({
          hospcode: mophHospcode,
          username: mophUsername,
          user_id_line: userId,
          created_at: new Date(),
          status: "active",
        });

        await linkRichMenu(userId, process.env.RICHMENU_SERVICE);
      }

      res.status(200).json({ status: "success" });
    } else {
      console.error("The 'sub' property is missing in the decoded profile.");
      res.status(400).json({ error: "Missing 'sub' property in Line profile" });
    }
  } catch (error) {
    console.error("Error in check-user-moph-ic-v2:", error);
    res.status(500).json({
      error: "Internal server error For Get LineVerifyIDToken Or MOPH AUTH",
    });
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
