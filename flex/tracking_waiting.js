const moment = require("moment-timezone");
require("moment/locale/th");
exports.tracking_waiting = async (TicketDetail) => {
  const flexMessage = {
    sender: {
      name: "น้อล DDDC HelpDesk",
      iconUrl: "https://ddc.moph.go.th/dddc-job/assets/img/dddc_logo.png",
    },
    type: "flex",
    altText: "Ticket",
    contents: {
      type: "bubble",
      size: "mega",
      direction: "ltr",
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "หมายเลขการติดตาม",
                color: "#ffffff66",
                size: "sm",
              },
              {
                type: "text",
                text: TicketDetail.ticket_number,
                color: "#ffffff",
                size: "xl",
                flex: 4,
                weight: "bold",
              },
            ],
          },
          {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "ผู้แจ้ง",
                color: "#ffffff66",
                size: "sm",
              },
              {
                type: "text",
                text: TicketDetail.reporter,
                color: "#ffffff",
                size: "xl",
                flex: 4,
                weight: "bold",
              },
            ],
          },
        ],
        paddingAll: "20px",
        backgroundColor: "#0367D3",
        spacing: "md",
        height: "154px",
        paddingTop: "22px",
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "text",
                text: moment(TicketDetail.created_at)
                  .tz("Asia/Bangkok")
                  .add(543, "years")
                  .locale("th") // Set the Thai locale
                  .format("DD MMM YY HH:mm"),
                size: "sm",
                margin: "none",
                flex: 5,
              },
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "filler",
                  },
                  {
                    type: "box",
                    layout: "vertical",
                    contents: [],
                    cornerRadius: "30px",
                    height: "12px",
                    width: "12px",
                    borderColor: "#EF454D",
                    borderWidth: "2px",
                  },
                  {
                    type: "filler",
                  },
                ],
                flex: 0,
              },
              {
                type: "text",
                text: "รับเรื่องเข้าระบบ",
                gravity: "center",
                flex: 4,
                size: "sm",
              },
            ],
            spacing: "lg",
            cornerRadius: "30px",
            margin: "xl",
            position: "relative",
          },
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "box",
                layout: "baseline",
                contents: [
                  {
                    type: "filler",
                  },
                ],
                flex: 5,
              },
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                      {
                        type: "filler",
                      },
                      {
                        type: "box",
                        layout: "vertical",
                        contents: [],
                        width: "2px",
                        backgroundColor: "#EF454D",
                      },
                      {
                        type: "filler",
                      },
                    ],
                    flex: 1,
                  },
                ],
                width: "12px",
              },
              {
                type: "box",
                layout: "baseline",
                contents: [],
                flex: 4,
              },
            ],
            spacing: "lg",
            height: "64px",
            position: "relative",
            margin: "none",
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "button",
            action: {
              type: "message",
              label: "ติดตาม",
              text: "ติดตาม-" + TicketDetail.ticket_number,
            },
          },
        ],
      },
    },
  };
  return flexMessage;
};
