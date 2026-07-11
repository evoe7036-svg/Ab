const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

// 🔥 Random Funny Texts
const funnyTexts = [
  "🤣 এইডা কী করলা রে ভাই! ডিলিট দিলে কি FBI ভুলে যাবে?",
  "😹 হায় হায়! মেসেজ ডিলিট করে ভাবছে বাঁচবে!",
  "🐸 এই হালায় unsend মারছে, সবাই তাকাও!",
  "🤡 ডিলিট দিলেই কি পাপ ধুয়ে যায়?",
  "🙈 লজ্জা পাইছে নাকি? তাই মেসেজ উধাও!",
  "🫣 ভাবছে কেউ দেখেনি! কিন্তু Bot তো দেখছে 😈",
  "😂 এইটা ডিলিট না করলে ইতিহাস হয়ে যাইতো!",
  "🚨 UNSEND ALERT 🚨 ধরা খাইছে ভাই!",
  "😼 মেসেজ মারো, আবার ডিলিট! দুই নাম্বারি!",
  "🤣🤣 এই গ্রুপে unsend দিলে সম্মান থাকে না!"
];

module.exports = {
  config: {
    name: "resend",
    version: "2.2.0",
    author: "CYBER TEAM ☢️ (Funny Mod)",
    role: 0,
    shortDescription: "Auto resend unsent message (funny)",
    longDescription: "Automatically resend deleted messages with random funny roast",
    category: "general",
    countDown: 0
  },

  onStart: async function () {},

  onChat: async function ({ api, event, usersData, threadsData }) {
    const { threadID, messageID, senderID, body, attachments, type } = event;

    if (!global.resendData) global.resendData = new Map();
    const botID = api.getCurrentUserID();

    const threadData = await threadsData.get(threadID) || {};
    if (threadData.resend === false) return;
    if (senderID === botID) return;

    // Save normal message
    if (type !== "message_unsend") {
      global.resendData.set(messageID, {
        body,
        attachments,
        senderID
      });
      return;
    }

    // On unsend
    const oldMsg = global.resendData.get(messageID);
    if (!oldMsg) return;

    const userName = await usersData.getName(oldMsg.senderID);
    const roast = funnyTexts[Math.floor(Math.random() * funnyTexts.length)];

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    // 📝 TEXT ONLY
    if (!oldMsg.attachments || oldMsg.attachments.length === 0) {
      return api.sendMessage({
        body:
`${roast}

👤 অপরাধী: @${userName}

📝 যা লিখছিল:
「 ${oldMsg.body || "কিছু লেখে নাই, তাও ডিলিট 🤡"} 」`,
        mentions: [{ tag: userName, id: oldMsg.senderID }]
      }, threadID);
    }

    // 📸 ATTACHMENT + TEXT
    let files = [];
    let i = 0;

    for (const att of oldMsg.attachments) {
      i++;
      const ext = att.url.split(".").pop().split("?")[0];
      const filePath = `${cacheDir}/resend_${Date.now()}_${i}.${ext}`;
      const data = (await axios.get(att.url, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(filePath, Buffer.from(data));
      files.push(fs.createReadStream(filePath));
    }

    return api.sendMessage({
      body:
`${roast}

👤 অপরাধী: @${userName}
${oldMsg.body ? `📝 Text:\n${oldMsg.body}` : "🙈 কোনো লেখা ছিল না!"}

📸 প্রমাণসহ ধরা খাইছে 🤣`,
      attachment: files,
      mentions: [{ tag: userName, id: oldMsg.senderID }]
    }, threadID);
  },

  run: async function ({ api, event, threadsData }) {
    const { threadID } = event;
    const data = await threadsData.get(threadID) || {};

    data.resend = !data.resend;
    await threadsData.set(threadID, data);

    return api.sendMessage(
      `😂 Resend Funny Mode: ${data.resend ? "ON" : "OFF"}`,
      threadID
    );
  }
};
