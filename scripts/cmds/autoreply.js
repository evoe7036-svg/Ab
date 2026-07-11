const fs = require("fs-extra");

module.exports = {
  config: {
    name: "autoreplybot",
    aliases: ["auto", "ar"],
    version: "6.3.0",
    author: "ALVI (Fixed)",
    countDown: 3,
    role: 0,
    shortDescription: {
      en: "Auto reply bot"
    },
    longDescription: {
      en: "Auto reply with trigger words"
    },
    category: "no prefix"
  },

  // ✅ MUST for Goat Bot v2
  onStart: async function () {},

  onChat: async function ({ api, event }) {
    try {
      const { threadID, messageID, senderID, body } = event;
      if (!body || senderID == api.getCurrentUserID()) return;

      const msg = body.toLowerCase();

      const responses = {
       "ebrahim": " কিরে তুই আমার বস ইব্রাহিমের নাম ধরে ডাকিস তোর সাহস তো কম না 😾",
      "alu": "কিরে আবাল তুই গ্রুপের এডমিনের নাম ভ্যাটকাস কেন 😾",
       "murgi chur": "বস এক হালায় আপনাকে মুরগী চোর বলছে , আপনি শুধু একবার আদেশ করুন, আজকে হালার নানিরে চমলক্ক করে দিমু 😑🥴",
       "gaiga": "মর গিয়া তুই!🤧",
       "ebcd": "𝐄𝐁𝐂𝐃 = 𝐄𝐛𝐫𝐚𝐡𝐢𝐦 𝐁𝐨𝐬𝐬, 𝐂𝐨𝐨𝐥 𝐚𝐧𝐝 𝐚 𝐋𝐢𝐭𝐭𝐥𝐞 𝐃𝐚𝐧𝐠𝐞𝐫𝐨𝐮𝐬✨",
       "eb": "EB meaning ইব্রাহিম বড় ভাই 💙",
       "jaiga": "মর গিয়া তুই!🤧",
       "boss": "আমার বস ইব্রাহিম সম্মান দিয়া কথা কবি! 🤧",
       "sadiya": "সাদিয়া চা দিয়ে বিস্কুট খায় ☕🤌",
      "jb": "জিনিয়া বলদ 🤧",
       "🙂": "যে বলদ একটার বেশি ছেনটি খাইবো ওই হালা গে 🤡💩",
       "☕": "রাক্ষসী রানী কট কটি ☕🤌",
       "kire": "হ্যা বস কেমন আছেন..?☺️",
       "bot er baccha": "আমার বাচ্চা তো তোমার গার্লফ্রেন্ডের পেটে..!!🌚⛏️"
      };

      for (let key in responses) {
        if (msg.includes(key)) {
          return api.sendMessage(responses[key], threadID, messageID);
        }
      }

    } catch (e) {
      console.log("AutoReply Error:", e);
    }
  }
};
