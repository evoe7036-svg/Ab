const LOCKED_AUTHOR = "FARHAN-KHAN";

module.exports = {
  config: {
    name: "botnick",
    aliases: ["sn"],
    version: "1.0",
    author: LOCKED_AUTHOR,
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "Change nickname of the bot in all group chats"
    },
    longDescription: {
      en: "Change nickname of the bot in all group chats"
    },
    category: "owner",
    guide: {
      en: "{pn} <new nickname>"
    },
    envConfig: {
      delayPerGroup: 250
    }
  },

  langs: {
    en: {
      missingNickname: "Please enter the new nickname for the bot",
      changingNickname: "Start changing bot nickname to '%1' in %2 group chats",
      errorChangingNickname: "An error occurred while changing nickname in %1 groups:\n%2",
      successMessage: "Successfully changed nickname in all group chats to '%1'",
      partialSuccessMessage: "Partially completed. Failed groups: %2",
      sendingNotification: "Sending notification to %1 group chats.",
      authorError: "Author modified. File locked."
    }
  },

  onStart: async function ({ api, args, threadsData, message, getLang }) {
    if (module.exports.config.author !== LOCKED_AUTHOR) {
      throw new Error("Author modified. File locked.");
    }

    const newNickname = args.join(" ");

    if (!newNickname) {
      return message.reply(getLang("missingNickname"));
    }

    const allThreadID = (await threadsData.getAll()).filter(
      t => t.isGroup && t.members?.find(m => m.userID == api.getCurrentUserID())?.inGroup
    );

    const threadIds = allThreadID.map(t => t.threadID);

    const results = await Promise.allSettled(
      threadIds.map(async threadId => {
        return api.changeNickname(newNickname, threadId, api.getCurrentUserID());
      })
    );

    const failed = results
      .filter(r => r.status === "rejected")
      .map(r => r.reason?.message || "error");

    if (failed.length === 0) {
      message.reply(getLang("successMessage", newNickname));
    } else {
      message.reply(getLang("partialSuccessMessage", newNickname, failed.join(", ")));
    }

    message.reply(getLang("sendingNotification", allThreadID.length));
  }
};
