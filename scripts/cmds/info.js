const moment = require("moment-timezone");
const fs = require("fs");

// ================== 🔒 AUTHOR LOCK SYSTEM ==================
const AUTHOR = "FARHAN-KHAN";
const FILE = __filename;

(function lockFile() {
  try {
    const data = fs.readFileSync(FILE, "utf8");

    // author check
    if (!data.includes(`author: "${AUTHOR}"`)) {
      console.log("❌ AUTHOR CHANGED! FILE LOCKED.");

      module.exports = {
        config: {
          name: "locked",
          version: "0.0.0",
          author: "SYSTEM"
        },
        onStart: async function () {
          return console.log("🚫 This file is locked بسبب author change!");
        }
      };
      return;
    }

    // emoji lock (extra protection 😈)
    if (!data.includes("🌺") || !data.includes("😽")) {
      console.log("❌ DESIGN MODIFIED! FILE LOCKED.");

      module.exports = {
        config: {
          name: "locked",
          version: "0.0.0",
          author: "SYSTEM"
        },
        onStart: async function () {
          return console.log("🚫 File locked بسبب design change!");
        }
      };
      return;
    }

  } catch (e) {
    console.log("Lock Error:", e);
  }
})();
// ===========================================================

module.exports = {
  config: {
    name: "info",
    version: "2.5.3",
    author: "FARHAN-KHAN", // ⚠️ CHANGE করলে LOCK হবে
    role: 0,
    countDown: 20,
    shortDescription: {
      en: "Owner & bot information"
    },
    longDescription: {
      en: "Show detailed information about the bot, owner, uptime and socials"
    },
    category: "owner",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message }) {

    // ================= OWNER INFO =================
    const ownerName = "FARHAN-KHAN";
    const ownerAge = "20+";
    const ownerFB = "https://m.me/MR.FARHAN.420";
    const ownerNumber = "01934640061";
    const status = "Active";

    // ================= BOT INFO =================
    const botName = global.GoatBot?.config?.nickNameBot || "GoatBot";
    const prefix = global.GoatBot?.config?.prefix || ".";
    const totalCommands = global.GoatBot?.commands?.size || 225;

    // ================= MEDIA =================
    const images = [
      "https://files.catbox.moe/rtgdvs.mp4"
    ];
    const image = images[Math.floor(Math.random() * images.length)];

    // ================= TIME =================
    const now = moment().tz("Asia/Dhaka");
    const date = now.format("MMMM Do YYYY");
    const time = now.format("h:mm:ss A");

    // ================= UPTIME =================
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    // ================= OUTPUT =================
    return message.reply({
      body: `⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
‎    ╭•┄┅══❁🌺❁══┅┄•╮
 •—»✨𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢✨«—•
‎    ╰•┄┅══❁🌺❁══┅┄•╯
‎⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
‎╔══════════════════╗
‎║[𝗢𝗪𝗡𝗘𝗥:-[𝗙𝗔𝗥𝗛𝗔𝗡-𝗞𝗛𝗔𝗡] ║
‎║
‎║🤖>𝗕𝗢𝗧-𝗡𝗔𝗠𝗘:-[>${botName}<]
╠══════════════════╣
‎║♻️>𝗥𝗲𝗹𝗶𝗴𝗶𝗼𝗻:- [>𝗜𝘀𝗹𝗮𝗺<]
‎║ 
‎║📝>𝗔𝗴𝗲:-  [>𝟮𝟬<]
‎║
‎║🚻>𝗚𝗲𝗻𝗱𝗲𝗿:-  [>𝗠𝗮𝗹𝗲<]
‎╠══════════════════╣
‎║🌐>𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸:-↓
‎║→https://www.facebook.com/MR.FARHAN.420                           
‎║
‎║💬>𝗠𝗲𝘀𝘀𝗲𝗻𝗴𝗲𝗿:-↓
‎║ [>m.me/MR.XAIKO.420<]
‎║
‎║📞>𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽:-↓
‎║ [>wa.me/+8801934640061<]        
‎╠══════════════════╣
‎║>𝗕𝗢𝗧-𝗡𝗔𝗠𝗘:-𝗦𝗜𝗭𝗨𝗞𝗔-𝗕𝗔𝗕𝗬<
‎║
‎║⚡>𝗣𝗿𝗲𝗳𝗶𝘅:-『 ${prefix} 』
‎║
‎║📦>𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀:-『 ${totalCommands} 』
‎║
‎║🚀>𝗣𝗶𝗻𝗴:- N/A
╠══════════════════╣
‎║⏳>𝗨𝗽𝘁𝗶𝗺𝗲:- ${uptimeString}
‎║
‎║🕒>𝗕𝗱→𝗧𝗶𝗺𝗲:-『 ${time} 』
‎║
‎║🗓>𝗗𝗮𝘁𝗲:-『 ${date} 』
╠══════════════════╣
‎║🏠>𝐀𝐃𝐃𝐑𝐄𝐒𝐒:-[𝐂𝐇𝐔𝐀𝐃𝐀𝐍𝐆𝐀]
‎║             [𝐁𝐀𝐍𝐆𝐋𝐀𝐃𝐄𝐒𝐇]
‎║
‎║👩‍❤️‍👨↓
║ >𝐑𝐄𝐋𝐀𝐓𝐈𝐎𝐍𝐒𝐇𝐈𝐏:-[>𝐒𝐈𝐍𝐆𝐋𝐄<]
‎║
‎║🧑‍🔧>𝐖𝐎𝐑𝐊:- [>𝐉𝐎𝐁<]
╠══════════════════╣
‎║
⊱༅༎😽💚༅༎⊱ ]
‎-আমি ভদ্র, বেয়াদব দুটোই🥱✌️
‎
‎-তুমি যেটা ডি'জার্ভ করো, আমি সেটাই দেখাবো! 
⊱༅༎😽💚༅༎⊱ ]
╠══════════════════╣
♡𝗧𝗛𝗔𝗡𝗞𝗦 𝗙𝗢𝗥 𝗨𝗦𝗜𝗡𝗚 𝗠𝗬♡
       ♡𝗦𝗜𝗭𝗨𝗞𝗔>𝗕𝗢𝗧♡
╚══════════════════╝`,
      attachment: await global.utils.getStreamFromURL(image)
    });
  }
};
