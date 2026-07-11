const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "text_voice",
    version: "1.0.5",
    author: "MR_FARHAN", // ⚠️ DO NOT CHANGE THIS (LOCKED)
    countDown: 1,
    role: 0,
    shortDescription: "Ultra Fast Voice Reply",
    longDescription: "Sends specific voice messages instantly using local cache",
    category: "system"
  },

  // ==============================
  // 🔒 AUTHOR LOCK SYSTEM
  // ==============================
  _authorLock: function () {
    const expectedAuthor = "MR_FARHAN";
    if (module.exports.config.author !== expectedAuthor) {
      throw new Error("🚫 AUTHOR LOCKED: You are not allowed to change author name!");
    }
  },

  onStart: async function () {},

  onChat: async function ({ event, message }) {
    // 🔒 Run lock check every time
    this._authorLock();

    if (!event.body) return;

    const input = event.body.toLowerCase().trim();

    const voiceMap = {
      "magi": "https://files.catbox.moe/ecgpak.mp4",
      "মাগি": "https://files.catbox.moe/ecgpak.mp4",
      
      "খানকি": "https://files.catbox.moe/ecgpak.mp4",
      "khanki": "https://files.catbox.moe/ecgpak.mp4",

      "farhan": "https://files.catbox.moe/tvpfee.mp3",
      "ফারহান": "https://files.catbox.moe/tvpfee.mp3",

      "sizuka": "https://files.catbox.moe/3u6shs.mp3",
      "সিজুকা": "https://files.catbox.moe/3u6shs.mp3",

      "good night": "https://files.catbox.moe/i29m4q.mp3",
      "গুড নাইট": "https://files.catbox.moe/i29m4q.mp3",

      "good morning": "https://files.catbox.moe/8gzqx5.mp3",
      "গুড মর্নিং": "https://files.catbox.moe/8gzqx5.mp3"
    };

    if (voiceMap[input]) {
      const audioUrl = voiceMap[input];
      const cacheDir = path.join(__dirname, "cache", "voices");
      fs.ensureDirSync(cacheDir);

      const fileName = `${Buffer.from(input).toString("hex")}.mp3`;
      const filePath = path.join(cacheDir, fileName);

      try {
        if (fs.existsSync(filePath)) {
          return await message.reply({
            attachment: fs.createReadStream(filePath)
          });
        }

        const response = await axios.get(audioUrl, {
          responseType: "arraybuffer"
        });

        fs.writeFileSync(filePath, Buffer.from(response.data));

        await message.reply({
          attachment: fs.createReadStream(filePath)
        });

      } catch (error) {
        console.error("Error sending voice:", error);
      }
    }
  }
};
