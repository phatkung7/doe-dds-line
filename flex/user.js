exports.getUserFlex = (userId, pictureUrl, name) => {
  return {
    type: "flex",
    altText: "New User!",
    contents: {
      type: "bubble",
      hero: {
        type: "image",
        url: `${pictureUrl}`,
        size: "full",
        aspectRatio: "20:13",
        aspectMode: "cover",
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: `${name}`,
            weight: "bold",
            size: "xl",
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          {
            type: "button",
            style: "secondary",
            height: "sm",
            action: {
              type: "uri",
              label: "Profile",
              uri: `https://liff.line.me/2000198531-AZpzJ9K0?uid=${userId}`,
            },
          },
          {
            type: "button",
            style: "primary",
            height: "sm",
            action: {
              type: "postback",
              label: "Like",
              data: `{"action":"like","uid":"${userId}"}`,
            },
          },
          {
            type: "box",
            layout: "vertical",
            contents: [],
            margin: "sm",
          },
        ],
        flex: 0,
      },
    },
  };
};
