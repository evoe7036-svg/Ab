module.exports = {
  config: {
    name: "teg", // 👈 এখানে tag থেকে teg করা হয়েছে
    version: "2.0",
    author: "Shahadat Islam × Modified by ChatGPT",
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "Mention all members multiple times"
    },
    longDescription: {
      en: "Tag everyone in the group with custom repeat count"
    },
    category: "group",
    guide: {
      en: "{pn} [count]"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const threadID = event.threadID;

      const threadInfo = await api.getThreadInfo(threadID);
      const memberIDs = threadInfo.participantIDs;

      const repeatCount = parseInt(args[0]) || 1;
      const botID = api.getCurrentUserID();

      const mentions = [];

      for (const id of memberIDs) {
        if (id !== botID) {
          mentions.push({
            tag: "@everyone",
            id: id
          });
        }
      }

      const msg =
`📢 @everyone
আপনি কি Group এসে আড্ডা দিতে দূর্বল..?🤔
Sms দিতে ভয় পান ?🤕
নাকি লজ্জা পান ?...🙈

তাই...
ব্যবহার করুন পাহাড়ি গাছ-গাছাড়া থেকে তৈরি👌
Left নামক হারবাল 😹
এক ফাইলই যথেষ্ট ।🐸`;

      for (let i = 0; i < repeatCount; i++) {
        await api.sendMessage(
          {
            body: msg,
            mentions
          },
          threadID
        );

        await new Promise(r => setTimeout(r, 2000));
      }

    } catch (e) {
      console.log(e);
      api.sendMessage("❌ | Tag দিতে সমস্যা হয়েছে!", event.threadID);
    }
  }
};
