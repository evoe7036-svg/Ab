const fs = require("fs-extra");
const axios = require("axios");
const canvas = require("canvas");

module.exports = {
  config: {
    name: "rip",
    version: "5.4",
    author: "FINAL PRO FIX",
    countDown: 5,
    role: 0,
    shortDescription: "Rip meme without extra name",
    category: "image"
  },

  onStart: async function ({ message, event, api }) {
    const path = __dirname + "/cache/rip.png";

    try {
      if (!fs.existsSync(__dirname + "/cache")) {
        fs.mkdirSync(__dirname + "/cache");
      }

      let uid;
      if (event.type === "message_reply") {
        uid = event.messageReply.senderID;
      } else if (event.mentions && Object.keys(event.mentions).length > 0) {
        uid = Object.keys(event.mentions)[0];
      } else {
        uid = event.senderID;
      }

      const userInfo = await api.getUserInfo(uid);
      const name = userInfo[uid]?.name || "User";

      const avatarUrl = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      let avatarBuffer;
      try {
        const res = await axios.get(avatarUrl, { responseType: "arraybuffer" });
        avatarBuffer = Buffer.from(res.data, "utf-8");
      } catch (e) {
        const fallbackRes = await axios.get(
          `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=512`,
          { responseType: "arraybuffer" }
        );
        avatarBuffer = Buffer.from(fallbackRes.data, "utf-8");
      }

      const cvs = canvas.createCanvas(500, 670);
      const ctx = cvs.getContext("2d");

      const bg = await canvas.loadImage("https://i.imgur.com/jHrYZ5Y.jpeg");
      ctx.drawImage(bg, 0, 0, 500, 670);

      // --- বাড়তি সব নাম এবং ব্যাকগ্রাউন্ড সেকশন রিমুভ করা হয়েছে ---

      const avatar = await canvas.loadImage(avatarBuffer);

      ctx.save();
      ctx.beginPath();
      ctx.arc(119, 558, 89, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(avatar, 30, 469, 178, 178);
      ctx.restore();

      fs.writeFileSync(path, cvs.toBuffer());

      await message.reply({
        body: `তুই একটা বলদ 🤡\n${name} এর মাথায় গোবর ছাড়া কিছু নাই 🤣`,
        attachment: fs.createReadStream(path)
      });

      setTimeout(() => {
        if (fs.existsSync(path)) fs.unlinkSync(path);
      }, 5000);

    } catch (err) {
      console.error(err);
      if (fs.existsSync(path)) fs.unlinkSync(path);
      message.reply("❌ | Image generate করতে সমস্যা হয়েছে!");
    }
  }
};
