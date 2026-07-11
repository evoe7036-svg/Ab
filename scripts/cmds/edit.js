const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "edit",
    aliases: ["nedit", "edit2"],
    version: "1.6",
    author: "FARHAN-KHAN",
    countDown: 15,
    role: 0,
    shortDescription: { en: "Edit image with Nano AI" },
    longDescription: { en: "Edit image using Nano AI with enhanced stability" },
    category: "image",
    guide: {
      en: "{pn} <prompt> --ratio <1:1|4:3|3:2|16:9>"
    }
  },

  onStart: async function ({ message, event, api, args }) {
    const hasPhotoReply = event.type === "message_reply" && event.messageReply?.attachments?.[0]?.type === "photo";

    if (!hasPhotoReply) {
      return message.reply("Please reply to an image to edit.");
    }

    const input = args.join(" ");
    if (!input) return message.reply("Please provide a prompt.");

    const ratioMatch = input.match(/--ratio\s+(1:1|4:3|3:2|16:9)/);
    const ratio = ratioMatch ? ratioMatch[1] : "1:1";
    const prompt = input.replace(/--ratio\s+(1:1|4:3|3:2|16:9)/, "").trim();

    const imageUrl = event.messageReply.attachments[0].url;
    const cacheDir = path.join(__dirname, "cache");
    const cachePath = path.join(cacheDir, `edit_${Date.now()}.png`);

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const res = await axios.get("https://rifatapiv3.vercel.app/api/ai-image/nano", {
        params: { 
          url: imageUrl, 
          p: prompt,
          ratio: ratio
        },
        timeout: 180000
      });

      const resultUrl = res.data?.result;

      if (!resultUrl || res.data.status !== "success") {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return message.reply("Failed to edit image. Server might be busy.");
      }

      await fs.ensureDir(cacheDir);

      const imageRes = await axios.get(resultUrl, {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
        }
      });

      await fs.writeFile(cachePath, Buffer.from(imageRes.data));

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      await message.reply({
        body: `Prompt: ${prompt}\nRatio: ${ratio}`,
        attachment: fs.createReadStream(cachePath)
      });

    } catch (err) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      const errorDetail = err.response?.status === 500 ? "API Server Error (500)" : err.message;
      return message.reply(`Error: ${errorDetail}`);
    } finally {
      if (fs.existsSync(cachePath)) {
        setTimeout(() => fs.remove(cachePath).catch(() => {}), 10000);
      }
    }
  }
};
