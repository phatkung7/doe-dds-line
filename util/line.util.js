const crypto = require("crypto");
const axios = require("axios");
const qs = require("qs");
const moment = require("moment");

const LINE_MESSAGING_API = process.env.LINE_MESSAGING_API;

const LINE_MESSAGING_OAUTH_ISSUE_TOKENV1 =
  process.env.LINE_MESSAGING_OAUTH_ISSUE_TOKENV1;
const LINE_MESSAGING_OAUTH_ISSUE_TOKENV2 =
  process.env.LINE_MESSAGING_OAUTH_ISSUE_TOKENV2;
const LINE_MESSAGING_OAUTH_ISSUE_TOKENV3 =
  process.env.LINE_MESSAGING_OAUTH_ISSUE_TOKENV3;
const LINE_MESSAGING_OAUTH_TOKEN_VERIFY =
  process.env.LINE_MESSAGING_OAUTH_TOKEN_VERIFY;

const LINE_CHANNEL_ID = process.env.LINE_CHANNEL_ID;
const LIFF_CHANNEL_ID = process.env.LIFF_CHANNEL_ID;
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;

const LINE_NOTIFY_API = process.env.LINE_NOTIFY_API;
const LINE_NOTIFY = process.env.LINE_NOTIFY;

const LINE_HEADER = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
};
const LINE_SIGNING_KEY = {
  alg: "RS256",
  typ: "JWT",
  kid: `${process.env.ASSERTION_SIGNING_KEY}`,
};

exports.pushLineNotify = async (message) => {
  const FormData = require("form-data");
  let data = new FormData();
  data.append("message", message);
  return await axios({
    method: "post",
    maxBodyLength: Infinity,
    url: `${LINE_NOTIFY_API}`,
    headers: {
      Authorization: `Bearer ${LINE_NOTIFY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  });
};

exports.getProfile = async (userId) => {
  const issue_token = await issueTokenV3();
  const access_token = issue_token.access_token;

  console.log("userId", userId);
  console.log(access_token);
  console.log(`${LINE_MESSAGING_API}/profile/${userId}`);

  return await axios({
    method: "get",
    maxBodyLength: Infinity,
    url: `${LINE_MESSAGING_API}/profile/${userId}`,
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });
};

exports.broadcast = async (payload) => {
  const issue_token = await issueTokenV3();
  const access_token = issue_token.access_token;
  return axios({
    method: "post",
    url: `${LINE_MESSAGING_API}/message/broadcast`,
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    data: payload,
  });
  Ï;
};

exports.broadcastConsumption = async (payload) => {
  const issue_token = await issueTokenV3();
  const access_token = issue_token.access_token;
  /* Quota Message Limit */
  let quota_quota = await getQuota(access_token);
  console.log("quota_quota", quota_quota);
  /* Total Usage */
  let quota_consumption = await getConsumption(access_token);
  console.log("quota_consumption", quota_consumption);

  /* Follower by Channel */
  let quota_number_of_followers = await getNumberOfFollowers(access_token);

  console.log("quota_number_of_followers", quota_number_of_followers);
  if (
    parseInt(quota_quota.value - quota_consumption.totalUsage) >
    quota_number_of_followers.followers
  ) {
    return axios({
      method: "post",
      url: `${LINE_MESSAGING_API}/message/broadcast`,
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      data: payload,
    });
  }
};

exports.multicast = async (data) => {
  const issue_token = await issueTokenV3();
  const access_token = issue_token.access_token;
  return axios({
    method: "post",
    url: `${LINE_MESSAGING_API}/message/multicast`,
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    data: data,
  });
};

exports.push = async (userId, payload) => {
  const issue_token = await issueTokenV3();
  const access_token = issue_token.access_token;
  console.log(access_token);
  return axios({
    method: "post",
    url: `${LINE_MESSAGING_API}/message/push`,
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      to: userId,
      messages: [payload],
    }),
  });
};

exports.validatePush = async (payload) => {
  const issue_token = await issueTokenV3();
  const access_token = issue_token.access_token;
  console.log(access_token);
  return axios({
    method: "post",
    url: `${LINE_MESSAGING_API}/message/validate/push`,
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      messages: [payload],
    }),
  });
};

exports.pushHandleRetryKey = async (userId, payload) => {
  const issue_token = await issueTokenV3();
  const access_token = issue_token.access_token;
  let response = await axios({
    method: "post",
    url: `${LINE_MESSAGING_API}/message/push`,
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      to: userId,
      messages: [payload],
    }),
  });
  if (response.status === 500) {
    return await axios({
      method: "post",
      url: `${LINE_MESSAGING_API}/message/push`,
      headers: {
        Authorization: `Bearer ${access_token}`,
        "X-Line-Retry-Key": response.headers["x-line-request-id"],
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        to: userId,
        messages: [payload],
      }),
    });
  }
};
exports.reply = (token, payload) => {
  return axios({
    method: "post",
    url: `${LINE_MESSAGING_API}/message/reply`,
    headers: LINE_HEADER,
    data: JSON.stringify({
      replyToken: token,
      messages: payload,
    }),
  });
};
exports.replyDestination = (destination, token, payload) => {
  let line_channel_access_token = "";
  // Channel 1 : U6ec263fe81b899d07506bdfd22008f73
  // Channel 1 : Uaa23c850c183eb750ca24cb9f89dba90
  if (destination === "U6ec263fe81b899d07506bdfd22008f73") {
    line_channel_access_token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  } else if (destination === "Uaa23c850c183eb750ca24cb9f89dba90") {
    line_channel_access_token = process.env.LINE_CHANNEL_ACCESS_TOKEN_2;
  }

  return axios({
    method: "post",
    url: `${LINE_MESSAGING_API}/message/reply`,
    headers: {
      Authorization: `Bearer ${line_channel_access_token}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      replyToken: token,
      messages: payload,
    }),
  });
};

exports.replyShortLived = async (token, payload) => {
  const issue_token = await issueToken();

  console.log(issue_token);

  const access_token = issue_token.access_token;
  return axios({
    method: "post",
    url: `${LINE_MESSAGING_API}/message/reply`,
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      replyToken: token,
      messages: payload,
    }),
  });
};

exports.replySigningKey = async (token, payload) => {
  const issue_token = await issueTokenv2_1();
  const access_token = issue_token.access_token;
  return axios({
    method: "post",
    url: `${LINE_MESSAGING_API}/message/reply`,
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      replyToken: token,
      messages: payload,
    }),
  });
};

exports.replyStateless = async (token, payload) => {
  const issue_token = await issueTokenV3();
  const access_token = issue_token.access_token;
  return axios({
    method: "post",
    url: `${LINE_MESSAGING_API}/message/reply`,
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      replyToken: token,
      messages: payload,
    }),
  });
};

exports.verifySignature = (originalSignature, body) => {
  const signature = crypto
    .createHmac("SHA256", LINE_CHANNEL_SECRET)
    .update(JSON.stringify(body))
    .digest("base64");

  if (signature !== originalSignature) {
    functions.logger.error("Unauthorized");
    return false;
  }
  return true;
};

/* Method Get Insight*/
async function getQuota(accessToken) {
  let response = await axios({
    method: "get",
    maxBodyLength: Infinity,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    url: `${LINE_MESSAGING_API}/message/quota`,
  });
  return response.data;
}
async function getNumberOfFollowers(accessToken) {
  const currentDate = moment().format("YYYYMMDD");
  let response = await axios({
    method: "get",
    maxBodyLength: Infinity,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    url: `${LINE_MESSAGING_API}/insight/followers?date=${currentDate}`,
  });
  return response.data;
}
async function getConsumption(accessToken) {
  let response = await axios({
    method: "get",
    maxBodyLength: Infinity,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    url: `${LINE_MESSAGING_API}/message/quota/consumption`,
  });
  return response.data;
}

/* Issue Token */
/* Short-lived Channel Access Token : 30 Day */
async function issueToken() {
  let data = qs.stringify({
    grant_type: "client_credentials",
    client_id: LINE_CHANNEL_ID,
    client_secret: LINE_CHANNEL_SECRET,
  });
  let response = await axios({
    method: "post",
    maxBodyLength: Infinity,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    url: LINE_MESSAGING_OAUTH_ISSUE_TOKENV1,
    data: data,
  });
  return response.data;
}

/* Channel Access Token v2.1 : min 30 minute to max 30 Day */
async function issueTokenv2_1() {
  const jwk = file.privateKey;

  let payload = {
    iss: LINE_CHANNEL_ID,
    sub: LINE_CHANNEL_ID,
    aud: "https://api.line.me/",
    exp: Math.floor(new Date().getTime() / 1000) + 60 * 30,
    token_exp: 60 * 60 * 24 * 30,
  };

  let result = await jose.JWS.createSign(
    { format: "compact", fields: LINE_SIGNING_KEY },
    jwk
  )
    .update(JSON.stringify(payload))
    .final();

  console.log("result", result);

  let data = qs.stringify({
    grant_type: "client_credentials",
    client_assertion_type:
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    client_assertion: result,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: LINE_MESSAGING_OAUTH_ISSUE_TOKENV2,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  const response = await axios.request(config);

  console.log("response", response);

  return response.data;
}

/* Stateless Channel Access Token : 15 minute */
async function issueTokenV3() {
  let data = qs.stringify({
    grant_type: "client_credentials",
    client_id: LINE_CHANNEL_ID,
    client_secret: LINE_CHANNEL_SECRET,
  });
  let response = await axios({
    method: "post",
    maxBodyLength: Infinity,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    url: LINE_MESSAGING_OAUTH_ISSUE_TOKENV3,
    data: data,
  });
  return response.data;
}

//Verify ID token
exports.verifyIDToken = async (token) => {
  let data = qs.stringify({
    id_token: token,
    client_id: LIFF_CHANNEL_ID,
  });
  let response = await axios({
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    url: LINE_MESSAGING_OAUTH_TOKEN_VERIFY,
    data: data,
  });
  return response.data;
};

exports.linkRichMenu = async (userId, richMenuId) => {
  const issue_token = await issueTokenV3();
  const access_token = issue_token.access_token;

  return axios({
    method: "post",
    url: `${LINE_MESSAGING_API}/user/${userId}/richmenu/${richMenuId}`,
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });
};
