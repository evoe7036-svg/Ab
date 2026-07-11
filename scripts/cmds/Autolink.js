const fs = require("fs");
const { downloadVideo } = require("sagor-video-downloader");

// 🔒 LOCK CONFIG
const AUTHOR = "FARHAN-KHAN"; // ⚠️ DO NOT CHANGE AUTHOR NAME
const COMMAND_NAME = "autolink";

module.exports = {
    config: {
        name: COMMAND_NAME,
        version: "1.3",
        author: AUTHOR + " (DON'T CHANGE)", // ❌ কেউ এই নাম চেঞ্জ করতে পারবেন না
        countDown: 5,
        role: 0,
        shortDescription: "Auto-download & send videos silently (no messages)",
        category: "media",
    },

    onStart: async function () {
        // 🔒 SECURITY CHECK
        if (
            module.exports.config.author !== AUTHOR + " (DON'T CHANGE)" ||
            module.exports.config.name !== COMMAND_NAME
        ) {
            throw new Error("⛔ Unauthorized file modification detected!");
        }
    },

    onChat: async function ({ api, event }) {
        // 🔒 SECURITY CHECK (extra protection)
        if (
            module.exports.config.author !== AUTHOR + " (DON'T CHANGE)" ||
            module.exports.config.name !== COMMAND_NAME
        ) {
            return;
        }

        const threadID = event.threadID;
        const messageID = event.messageID;
        const message = event.body || "";

        const linkMatches = message.match(/(https?:\/\/[^\s]+)/g);
        if (!linkMatches || linkMatches.length === 0) return;

        const uniqueLinks = [...new Set(linkMatches)];

        api.setMessageReaction("⏳", messageID, () => {}, true);

        let successCount = 0;
        let failCount = 0;

        for (const url of uniqueLinks) {
            try {
                const { title, filePath } = await downloadVideo(url);
                if (!filePath || !fs.existsSync(filePath)) throw new Error();

                const stats = fs.statSync(filePath);
                const fileSizeInMB = stats.size / (1024 * 1024);

                if (fileSizeInMB > 25) {
                    fs.unlinkSync(filePath);
                    failCount++;
                    continue;
                }

                await api.sendMessage(
                    {
                        body:
`📥 ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ  
━━━━━━━━━━━━━━━  
🎬 ᴛɪᴛʟᴇ: ${title || "Video File"}  
📦 sɪᴢᴇ: ${fileSizeInMB.toFixed(2)} MB  
━━━━━━━━━━━━━━━`,
                        attachment: fs.createReadStream(filePath)
                    },
                    threadID,
                    () => fs.unlinkSync(filePath)
                );

                successCount++;

            } catch {
                failCount++;
            }
        }

        const finalReaction =
            successCount > 0 && failCount === 0 ? "✅" :
            successCount > 0 ? "⚠️" : "❌";

        api.setMessageReaction(finalReaction, messageID, () => {}, true);
    }
};
