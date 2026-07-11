const axios = require("axios");
const fs = require("fs-extra");
const FormData = require("form-data");

module.exports = {
  config: {
    name: "art",
    version: "1.1.0",
    author: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
    countDown: 5,
    role: 0,
    shortDescription: "Apply AI anime art style",
    longDescription: "Convert image to anime AI art style",
    category: "image",
    guide: {
      en: "reply to an image"
    }
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, messageReply } = event;
    const path = __dirname + "/cache/artify.jpg";

    if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
      return api.sendMessage(
        "❌ | অনুগ্রহ করে কোনো ছবির রিপ্লাই দিন!",
        threadID,
        messageID
      );
    }

    try {
      const imageUrl = messageReply.attachments[0].url;

      // download image
      const imgRes = await axios.get(imageUrl, {
        responseType: "arraybuffer"
      });

      fs.writeFileSync(path, Buffer.from(imgRes.data));

      // form data
      const form = new FormData();
      form.append("image", fs.createReadStream(path));

      // API request
      const apiRes = await axios.post(
        "https://art-api-97wn.onrender.com/artify?style=anime",
        form,
        {
          headers: form.getHeaders(),
          responseType: "arraybuffer"
        }
      );

      fs.writeFileSync(path, apiRes.data);

      return api.sendMessage(
        {
          body: "🎨 AI Artify সফল হয়েছে!",
          attachment: fs.createReadStream(path)
        },
        threadID,
        () => fs.unlinkSync(path),
        messageID
      );

    } catch (err) {
      console.log(err);
      return api.sendMessage(
        "❌ | Art generate করতে সমস্যা হয়েছে! আবার চেষ্টা করুন।",
        threadID,
        messageID
      );
    }
  }
};
