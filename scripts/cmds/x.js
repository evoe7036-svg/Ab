const axios = require("axios");
const fs = require("fs-extra");

// 🔒 AUTHOR LOCK (DO NOT CHANGE)
const EXPECTED_AUTHOR = "MR_FARHAN";

module.exports = {
  config: {
    name: "xreply",
    aliases: ["x"],
    author: EXPECTED_AUTHOR,
    category: "fun",
    version: "8.0",
    countDown: 5,
    role: 3,
    shortDescription: "Double message fakechat style",
    guide: {
      en: "{pn} <your text> | reply to someone"
    }
  },

  onStart: async function ({ message, usersData, event, args, api }) {

    // 🔒 ANTI-TAMPER CHECK
    if (module.exports.config.author !== EXPECTED_AUTHOR) {
      console.log("❌ AUTHOR LOCK TRIGGERED!");
      return;
    }

    const { senderID, messageReply, messageID } = event;

    if (!messageReply) return message.reply("Please reply to a message to create double chat!");

    message.reaction("⏳", messageID);

    try {
      // রিপ্লাই দেওয়া ব্যক্তির তথ্য (Target)
      const targetID = messageReply.senderID;
      const targetName = await usersData.getName(targetID);
      const targetAvatar = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const targetMsg = messageReply.body || "No text";

      // আপনার তথ্য (You)
      const myName = await usersData.getName(senderID);
      const myAvatar = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const myMsg = args.join(" ") || "Taile amar shate shate repeat koro";

      const quoteData = {
        type: "quote",
        format: "png",
        backgroundColor: "#1a1a1a",
        width: 512,
        height: 768,
        scale: 1.5,
        messages: [
          {
            entities: [],
            avatar: true,
            from: {
              id: parseInt(targetID),
              name: targetName,
              photo: { url: targetAvatar }
            },
            text: targetMsg,
            reply_to: null
          },
          {
            entities: [],
            avatar: true,
            from: {
              id: parseInt(senderID),
              name: myName,
              photo: { url: myAvatar }
            },
            text: myMsg,
            reply_to: null
          }
        ]
      };

      const res = await axios.post("https://bot.lyo.su/quote/generate", quoteData);

      const pathImg = __dirname + `/fake_double_${messageID}.png`;
      fs.writeFileSync(pathImg, Buffer.from(res.data.result.image, "base64"));

      message.reaction("✅", messageID);

      await message.reply({
        body: "",
        attachment: fs.createReadStream(pathImg)
      });

      fs.unlinkSync(pathImg);

    } catch (err) {
      console.error(err);
      message.reaction("❌", messageID);
      return message.reply("Error! Try again later.");
    }
  }
};
