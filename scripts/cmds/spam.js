module.exports = {
  config: {
    name: "spam",
    version: "2.1",
    author: "Islamick Cyber",
    countDown: 5,
    role: 2,
    shortDescription: "Silent spam",
    longDescription: "Spam بدون any start/end message",
    category: "fun",
    guide: {
      en: "{pn}spam <message> <amount>"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const adminIDs = ["100065568407761", "61556979016951"];

    if (!adminIDs.includes(event.senderID)) {
      return message.reply("❌ | Only bot admin can use this command!");
    }

    if (args.length < 2) return;

    const amount = parseInt(args[args.length - 1]);
    const text = args.slice(0, -1).join(" ");

    if (isNaN(amount) || amount <= 0 || amount > 100) return;

    const delay = ms => new Promise(r => setTimeout(r, ms));

    for (let i = 0; i < amount; i++) {
      await api.sendMessage(text, event.threadID);
      if (i < amount - 1) await delay(1500);
    }
  }
};
