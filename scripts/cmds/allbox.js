module.exports = {
  config: {
    name: "allgroup",
    aliases: ["allgc"],
    version: "1.4.1",
    role: 2,
    author: "FARHAN-KHAN",
    description: "Manage all groups: List, Leave, or Add yourself to any group.",
    category: "admin",
    guide: {
        en: "{pn}",
        bn: "{pn}"
    },
    countDown: 5
  },

  // 🔐 AUTHOR LOCK SYSTEM
  onLoad: function () {
    const AUTHOR = "FARHAN-KHAN";

    if (module.exports.config.author !== AUTHOR) {
      console.log("⛔ AUTHOR LOCK TRIGGERED!");
      console.log("🚫 File has been modified. Bot disabled this module.");

      // optional hard stop (you can remove if not needed)
      module.exports.config.name = "disabled";
      module.exports.onStart = () => {};
      module.exports.onReply = () => {};

      throw new Error("Author name changed! File locked.");
    }
  },

/* --- [ 🔐 ADMIN MODULE ] --- */

  onStart: async function ({ api, event, message, commandName }) {
    try {
      await api.getThreadList(25, null, ["INBOX"], (err, list) => {
        if (err) return message.reply("Error: Could not fetch group list.");

        const groups = list.filter(g => g.isGroup && g.isSubscribed);
        if (groups.length === 0) return message.reply("The bot is not in any groups.");

        let msg = "📊 [ ALL GROUPS MANAGEMENT ]\n\n";
        let groupIDs = [];

        groups.forEach((group, index) => {
          const name = group.name || "Unnamed Group";
          const members = group.participantIDs ? group.participantIDs.length : "0";
          msg += `${index + 1}. ${name}\n🆔 ID: ${group.threadID}\n👥 Members: ${members}\n\n`;
          groupIDs.push(group.threadID);
        });

        msg += '🎮 Actions:\n1. Reply "out <num>" to leave.\n2. Reply "add <num>" to join group.\n3. Reply "ban <num>" to block group.';

        return message.reply(msg, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID,
            groupIDs
          });
        });
      });
    } catch (e) {
      return message.reply("An unexpected error occurred.");
    }
  },

  onReply: async function ({ api, event, Reply, message, threadsData }) {
    const { author, groupIDs } = Reply;
    if (event.senderID != author) return;

    const input = event.body.split(" ");
    const action = input[0].toLowerCase();
    const index = parseInt(input[1]) - 1;
    const targetID = groupIDs[index];

    if (!targetID || isNaN(index)) return message.reply("Invalid selection.");

    if (action === "out") {
      try {
        await api.removeUserFromGroup(api.getCurrentUserID(), targetID);
        return message.reply(`✅ Left group: ${targetID}`);
      } catch {
        return message.reply("❌ Cannot leave group.");
      }
    }

    if (action === "add") {
      try {
        await api.addUserToGroup(author, targetID);
        return message.reply(`✅ Added you to: ${targetID}`);
      } catch {
        return message.reply("❌ Cannot add user.");
      }
    }

    if (action === "ban") {
      try {
        const data = await threadsData.get(targetID);
        if (!data.data) data.data = {};
        data.data.banned = true;
        await threadsData.set(targetID, data.data, "data");

        await api.sendMessage("🚫 This group is banned.", targetID);
        await api.removeUserFromGroup(api.getCurrentUserID(), targetID);

        return message.reply(`✅ Banned: ${targetID}`);
      } catch {
        return message.reply("❌ Failed to ban group.");
      }
    }
  }
};
