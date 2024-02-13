//Flex
const flexProcessing = require("./flex/tracking_processing.js");
const flexFinishing = require("./flex/tracking_finishing.js");
//const flexOrder = require("./flex/order.js");
//Line API
const MessagingApiClient =
  require("@line/bot-sdk").messagingApi.MessagingApiClient;

const SendPushMessageToUser = async (ticketStatus, userId, TicketDetail) => {
  //console.log(ticketStatus, userId, TicketDetail);
  let flex_ticketStatus;
  if (ticketStatus == "Processing") {
    flex_ticketStatus = await flexProcessing.tracking_processing(TicketDetail);
  } else if (ticketStatus == "Finish") {
    flex_ticketStatus = await flexFinishing.tracking_finishing(TicketDetail);
  }
  //Setting channelAccessToken
  const client = new MessagingApiClient({
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  });

  try {
    return await client.pushMessage({
      to: userId,
      messages: [flex_ticketStatus],
    });
  } catch (err) {
    console.error(err);
    return false;
  }
};

module.exports = {
  SendPushMessageToUser,
};
