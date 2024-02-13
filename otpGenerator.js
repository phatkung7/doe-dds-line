// otpGenerator.js
const speakeasy = require("speakeasy");

const generateSecret = (length = 20) => {
  return speakeasy.generateSecret({ length });
};

const generateTOTPCode = (secret = {}) => {
  return speakeasy.totp({
    secret,
    encoding: "base32",
  });
};

module.exports = {
  generateSecret,
  generateTOTPCode,
};
