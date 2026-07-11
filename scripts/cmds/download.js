const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "download",
    version: "1.4",
    author: "FARHAN-KHAN", // LOCKED AUTHOR
    countDown: 5,
    role: 0,
    shortDescription: "Download media from direct link",
    category: "media",
    guide: "{pn} <direct-link>"
  },

  onStart: async function ({ api, event, args }) {

    // ===== AUTHOR LOCK SYSTEM =====
    const LOCKED_AUTHOR = "FARHAN-KHAN";

    if (module.exports.config.author !== LOCKED_AUTHOR) {
      return api.sendMessage(
        "⛔ F I L E  L O C K E D\nAuthor change detected!\nThis command is disabled.",
        event.threadID,
        event.messageID
      );
    }
    // ==============================

    const url = args[0];

    if (!url) {
      return api.sendMessage(
        "⚠️ Pʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴅɪʀᴇᴄᴛ ᴅᴏᴡɴʟᴏᴀᴅ ʟɪɴᴋ.\n\nExample:\n/download https://example.com/video.mp4",
        event.threadID,
        event.messageID
      );
    }

    const supported = [
      ".mp4", ".mp3",
      ".jpg", ".jpeg", ".png", ".gif",
      ".pdf", ".docx", ".txt", ".zip"
    ];

    const cleanUrl = url.split("?")[0];
    const ext = path.extname(cleanUrl).toLowerCase();

    if (!supported.includes(ext)) {
      return api.sendMessage(
        "❌ Uɴsᴜᴘᴘᴏʀᴛᴇᴅ ғɪʟᴇ ᴛʏᴘᴇ!\n\nSupported:\nmp4, mp3, jpg, png, gif, pdf, docx, txt, zip",
        event.threadID,
        event.messageID
      );
    }

    const fileName = `download${ext}`;

    try {
      const loadingMsg = await api.sendMessage(
        "⏳ Dᴏᴡɴʟᴏᴀᴅɪɴɢ...",
        event.threadID
      );

      const res = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: 30000
      });

      fs.writeFileSync(fileName, res.data);

      api.unsendMessage(loadingMsg.messageID);

      return api.sendMessage(
        {
          body: `✅ Download Complete!\n📁 File: ${fileName}`,
          attachment: fs.createReadStream(fileName)
        },
        event.threadID,
        () => fs.unlinkSync(fileName)
      );

    } catch (err) {
      console.error(err);
      return api.sendMessage(
        "❌ Download failed! The link may not be direct or invalid.",
        event.threadID
      );
    }
  }
};
