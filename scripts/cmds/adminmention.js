const fs = require("fs-extra");

module.exports = {
  config: {
    name: "adminmention",
    version: "7.0.0",
    author: "Farhan-Khan",
    countDown: 0,
    role: 0,
    shortDescription: "Admin mention reply styled",
    category: "system"
  },

  onStart: async function () {},

  onChat: async function ({ event, message }) {

    // 🔒 AUTHOR LOCK
    if (this.config.author !== "Farhan-Khan") {
      console.log("⚠️ Author changed! Module stopped.");
      return;
    }

    // 👑 ADMINS
    const admins = [
      {
        uid: "100065568407761",
        names: ["ᎬᏴᎡᎪᎻᏆᎷ ᎪᎻᎪᎷᎬᎠ"]
      },
      {
        uid: "61559151975368",
        names: ["Jinia Maha"]
      },
      {
        uid: "61554317974657",
        names: ["Alisha Khan Samira"]
      }
    ];

    // 🔥 SAFE senderID fallback (IMPORTANT FIX)
    const senderID = String(
      event.senderID || event.author || event.userID || event.fromID || ""
    );

    // ❌ Admin নিজে message দিলে reply না
    if (admins.some(a => a.uid === senderID)) return;

    const text = (event.body || "").toLowerCase().trim();
    const mentionedIDs = event.mentions ? Object.keys(event.mentions) : [];

    // 🔍 MENTION DETECT FIXED
    const isMentioning = admins.some(admin =>
      senderID === admin.uid ||
      mentionedIDs.includes(admin.uid) ||
      text.includes(admin.uid) ||
      admin.names.some(name => text.includes(name.toLowerCase()))
    );

    if (!isMentioning) return;

    // 💬 CAPTIONS
    const captions = [
      "বস বলছে—\"এই আবালটা আবার কে?\" 😶🌫️📣",
      "মেনশন দিছস ঠিকই, কিন্তু বস তো এখন নেট অফ রাখছে 🤫📴",
      "বস বলল তোরে রেপ্লাই দিবে কিন্তু আগে তুই গোসল করে আয় 🤢🧼",
      "বস তো এখন চা খাচ্ছে, তুই ততক্ষণ মাথা ঠান্ডা রাখ বস পড়ে আসবে 😌🍵",
      "বস এক আবালে আপনাকে মেনশন দিছে 😑🌚😁",
      "বস এক পাগল ছাগল , আপনাকে ডাকতেছে 🐸🫵",
      "বস এক হালায় আপনার নাম ধরছে , আপনি শুধু একবার আদেশ করুন, আজকে হালার নানিরে চমলক্ক করে দিমু 😑🥴",
      "বস এক আবাল আপনাকে ডাকতেছে 😂😏",
      "আবাল তুই মেনশন দিবি না আমার বস রে 🥹"
    ];

    const rawCaption = captions[Math.floor(Math.random() * captions.length)];

    try {
      await message.reply({
        body: rawCaption
      });
    } catch (err) {
      console.log("Error sending admin reply:", err);
    }
  }
};
