const fs = require("fs-extra");
const axios = require("axios");
const Canvas = require("canvas");
const Jimp = require("jimp");

module.exports = {
  config: {
    name: "chor",
    version: "2.1.0",
    author: "CYBER ☢️ TEAM (fixed)",
    countDown: 5,
    role: 0,
    shortDescription: "Chor meme generator",
    category: "image"
  },

  circle: async function (image) {
    const img = await Jimp.read(image);
    img.circle();
    return await img.getBufferAsync("image/png");
  },

  onStart: async function ({ event, message }) {
    try {
      const path = __dirname + "/cache/chor.png";

      // ✅ FIXED ID DETECT SYSTEM
      let id = event.senderID;

      if (event.type === "message_reply" && event.messageReply?.senderID) {
        id = event.messageReply.senderID;
      } 
      else if (event.mentions && Object.keys(event.mentions).length > 0) {
        id = Object.keys(event.mentions)[0];
      }

      // 🔍 DEBUG (চাইলে দেখবি)
      console.log("Selected ID:", id);

      // 🎨 Canvas
      const canvas = Canvas.createCanvas(500, 670);
      const ctx = canvas.getContext("2d");

      const bg = await Canvas.loadImage("https://i.imgur.com/ES28alv.png");
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

      // 👤 Avatar fetch (IMPORTANT FIX)
      const avatarUrl = `https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;

      const avatar = (await axios.get(avatarUrl, {
        responseType: "arraybuffer"
      })).data;

      const circleAvatar = await this.circle(avatar);
      const avaImg = await Canvas.loadImage(circleAvatar);

      ctx.drawImage(avaImg, 48, 410, 111, 111);

      // 💾 Save & send
      const buffer = canvas.toBuffer();
      fs.writeFileSync(path, buffer);

      await message.reply({
        body: "চিপা খোর চিপায় গিয়ে ধরা খাইছে😁😁",
        attachment: fs.createReadStream(path)
      });

      fs.unlinkSync(path);

    } catch (err) {
      console.error(err);
      message.reply("❌ | Mention এর DP আনতে সমস্যা হয়েছে!");
    }
  }
};
