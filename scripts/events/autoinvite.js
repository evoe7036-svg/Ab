const { getTime } = global.utils;

module.exports = {
  config: {
    name: "autoinvite",
    version: "2.5",
    author: "Mohammad Akash / Modified",
    category: "events"
  },

  onStart: async ({ api, event, usersData, message }) => {
    const { threadID, logMessageData, author, logMessageType } = event;
    
    // শুধু মেম্বার লিভ নিলে বা রিমুভ করলে কাজ করবে
    if (logMessageType !== "log:unsubscribe") return;

    const leftID = logMessageData.leftParticipantFbId;
    const name = await usersData.getName(leftID);

    // ১. ইউজার যদি নিজে লিভ নেয়
    if (leftID == author) {
      await message.send(`তোর সাহস কম না গ্রুপের এডমিনের পারমিশন ছাড়া তুই লিভ নিস😡😠`);

      try {
        await api.addUserToGroup(leftID, threadID);
        
        const successMsg = {
          body: `শোন, ${name}, এই গ্রুপ হইলো গ্যাং!\nএখান থেকে যাইতে হলে এডমিনের পারমিশন লাগে!\nতুই পারমিশন ছাড়া লিভ নিছোস – তোকে আবার মাফিয়া স্টাইলে এড দিলাম।\n\n────꯭─⃝‌‌𝐄𝐛𝐫𝐚𝐡𝐢𝐦 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭────`
        };
        await message.send(successMsg);
        
      } catch (err) {
        await message.send(`সরি বস, ${name} কে আবার এড করতে পারলাম না।\nসম্ভবত উনি বটকে ব্লক করেছে অথবা তার প্রাইভেসি সেটিংসের কারণে এড করা যায় না।\n\n────꯭─⃝‌‌𝐄𝐛𝐫𝐚𝐡𝐢𝐦 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭────`);
      }
    } 
    
    // ২. এডমিন যদি কাউকে কিক দেয় (রিমুভ করে)
    else {
      await message.send(`তোমার এই গ্রুপে থাকার কোনো যোগ্যাতা নেই ছাগল😡\nতাই তোমাকে লাথি মেরে গ্রুপ থেকে বের করে দেওয়া হলো🤪 WELLCOME REMOVE🤧\n\n────꯭─⃝‌‌𝐄𝐛𝐫𝐚𝐡𝐢𝐦 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭────`);
    }
  }
};
