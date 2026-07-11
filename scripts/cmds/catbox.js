const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

/**
 * 🔒 AUTHOR LOCK SYSTEM
 * কেউ author change করলে ফাইল auto lock হয়ে যাবে
 */
const SOURCE_CODE = fs.readFileSync(__filename, "utf8");
if (!SOURCE_CODE.includes('author: "FARHAN-KHAN"')) {
  console.error("❌ FILE LOCKED: Author has been modified!");
  process.exit(1);
}

module.exports = {
  config: {
    name: "catbox",
    version: "1.0.1",
    author: "FARHAN-KHAN",
    role: 0,
    shortDescription: "Upload media to Catbox",
    longDescription: "Reply to an image, video, or audio file to upload it to Catbox and get the link.",
    category: "media",
    guide: "[reply to image/video/audio]",
    cooldowns: 5
  },

  onStart: async function ({ api, event }) {
    const { threadID, type, messageReply, messageID } = event;

    if (type !== "message_reply" || !messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
      return api.sendMessage(
        "❐ Please reply to a photo/video/audio file.",
        threadID,
        messageID
      );
    }

    const attachmentPaths = [];

    // 📥 download function
    const downloadAttachment = async (url, filePath) => {
      const writer = fs.createWriteStream(filePath);
      const response = await axios({
        url,
        method: "GET",
        responseType: "stream"
      });

      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
    };

    let index = 0;

    for (const item of messageReply.attachments) {
      try {
        const ext =
          item.type === "photo" ? "jpg" :
          item.type === "video" ? "mp4" :
          item.type === "audio" ? "mp3" :
          item.type === "animated_image" ? "gif" : "dat";

        const filePath = path.join(__dirname, `catbox_${Date.now()}_${index}.${ext}`);

        await downloadAttachment(item.url, filePath);
        attachmentPaths.push(filePath);
        index++;
      } catch (e) {
        console.error("Download error:", e);
      }
    }

    let resultMsg = "";

    for (const filePath of attachmentPaths) {
      try {
        const form = new FormData();
        form.append("reqtype", "fileupload");
        form.append("fileToUpload", fs.createReadStream(filePath));

        const res = await axios.post(
          "https://catbox.moe/user/api.php",
          form,
          { headers: form.getHeaders() }
        );

        resultMsg += `${res.data.trim()}\n`;
      } catch (err) {
        console.error("Upload failed:", err);
        resultMsg += "❌ Upload failed for one file.\n";
      } finally {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    }

    return api.sendMessage(resultMsg.trim(), threadID, messageID);
  }
};
