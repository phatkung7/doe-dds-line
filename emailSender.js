// emailSender.js
const nodemailer = require("nodemailer");
require("dotenv").config(); // Load environment variables from .env
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (options) => {
  try {
    const info = await transporter.sendMail(options);
    console.log({ info });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  sendEmail,
};
