module.exports = {
  config: {
    name: "groupupdate",
    version: "1.0",
    author: "Ebrahim",
    role: 0,
    category: "events"
  },

  onStart: async () => {},

  onEvent: async function ({ api, event, usersData }) {
    try {
      const { threadID, logMessageType, logMessageData, author } = event;

      if (!logMessageType) return;

      let authorName = "Unknown";
      try {
        authorName = await usersData.getName(author);
      } catch {}

      const send = async (msg) => {
        const info = await api.sendMessage(msg, threadID);

        setTimeout(() => {
          api.unsendMessage(info.messageID);
        }, 5000);
      };

      // 📝 Group Name
      if (logMessageType == "log:thread-name") {
        return send(
`╭━━━〔 📝 GROUP NAME UPDATED 〕━━━⬣
┃ ➤ New Name: ${logMessageData.name}
┃ ➤ By: ${authorName}
╰━━━━━━━━━━━━⬣`
        );
      }

      // ✏️ Nickname
      if (logMessageType == "log:user-nickname") {

        const uid =
          logMessageData.participant_id ||
          logMessageData.participantFbId;

        let targetName = "Unknown";

        try {
          targetName = await usersData.getName(uid);
        } catch {}

        return send(
`╭━━━〔 ✏️ NICKNAME UPDATED 〕━━━⬣
┃ ➤ User: ${targetName}
┃ ➤ Nickname: ${logMessageData.nickname || "Removed"}
┃ ➤ By: ${authorName}
╰━━━━━━━━━━━━⬣`
        );
      }

      // 👑 Admin Update
      if (logMessageType == "log:thread-admins") {

        const uid =
          logMessageData.target_id ||
          logMessageData.targetFbId;

        let targetName = "Unknown";

        try {
          targetName = await usersData.getName(uid);
        } catch {}

        if (logMessageData.ADMIN_EVENT == "add_admin") {
          return send(
`╭━━━〔 👑 NEW ADMIN ADDED 〕━━━⬣
┃ ➤ ${targetName} is now admin
┃ ➤ By: ${authorName}
╰━━━━━━━━━━━━⬣`
          );
        }

        if (logMessageData.ADMIN_EVENT == "remove_admin") {
          return send(
`╭━━━〔 ❌ ADMIN REMOVED 〕━━━⬣
┃ ➤ ${targetName} removed from admin
┃ ➤ By: ${authorName}
╰━━━━━━━━━━━━⬣`
          );
        }
      }

    } catch (e) {
      console.log(e);
    }
  }
};
