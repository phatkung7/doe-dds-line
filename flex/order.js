exports.order = async (userId, orderName) => {
  return {
    sender: {
      name: "น้อลบอท",
      iconUrl: "https://cdn-icons-png.flaticon.com/512/1533/1533105.png",
    },
    type: "flex",
    altText: "RECEIPT",
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "RECEIPT",
            weight: "bold",
            color: "#1DB446",
            size: "sm",
          },
          {
            type: "text",
            text: "Brown Store",
            weight: "bold",
            size: "xxl",
            margin: "md",
          },
          {
            type: "text",
            text: "Miraina Tower, 4-1-6 Shinjuku, Tokyo",
            size: "xs",
            color: "#aaaaaa",
            wrap: true,
          },
          {
            type: "separator",
            margin: "xxl",
          },
          {
            type: "box",
            layout: "vertical",
            margin: "xxl",
            spacing: "sm",
            contents: [
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: orderName,
                    size: "sm",
                    color: "#555555",
                    flex: 0,
                  },
                  {
                    type: "text",
                    text: "$2.99",
                    size: "sm",
                    color: "#111111",
                    align: "end",
                  },
                ],
              },
              {
                type: "separator",
                margin: "xxl",
              },
              {
                type: "box",
                layout: "horizontal",
                margin: "xxl",
                contents: [
                  {
                    type: "text",
                    text: "ITEMS",
                    size: "sm",
                    color: "#555555",
                  },
                  {
                    type: "text",
                    text: "3",
                    size: "sm",
                    color: "#111111",
                    align: "end",
                  },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "TOTAL",
                    size: "sm",
                    color: "#555555",
                  },
                  {
                    type: "text",
                    text: "$7.31",
                    size: "sm",
                    color: "#111111",
                    align: "end",
                  },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "CASH",
                    size: "sm",
                    color: "#555555",
                  },
                  {
                    type: "text",
                    text: "$8.0",
                    size: "sm",
                    color: "#111111",
                    align: "end",
                  },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "CHANGE",
                    size: "sm",
                    color: "#555555",
                  },
                  {
                    type: "text",
                    text: "$0.69",
                    size: "sm",
                    color: "#111111",
                    align: "end",
                  },
                ],
              },
            ],
          },
          {
            type: "separator",
            margin: "xxl",
          },
          {
            type: "box",
            layout: "horizontal",
            margin: "md",
            contents: [
              {
                type: "text",
                text: "PAYMENT ID",
                size: "xs",
                color: "#aaaaaa",
                flex: 0,
              },
              {
                type: "text",
                text: `#${userId}`,
                color: "#aaaaaa",
                size: "xs",
                align: "end",
              },
            ],
          },
        ],
      },
      styles: {
        footer: {
          separator: true,
        },
      },
    },
  };
};
