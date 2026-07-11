const { getStreamsFromAttachment } = global.utils;
const mediaTypes = ["photo", "png", "animated_image", "video", "audio"];

const TARGET_THREAD_ID = "25012294875129251";

module.exports = {
	config: {
		name: "call",
		aliases: ["callad", "called"],
		version: "1.6",
		author: "Farhan",
		countDown: 5,
		role: 0,
		shortDescription: {
			en: "send message to admin bot"
		},
		longDescription: {
			en: "send report, feedback, bug to admin"
		},
		category: "contacts admin",
		guide: {
			en: "{pn} <message>"
		}
	},

	onStart: async function ({ args, message, event, usersData, threadsData, api }) {
		if (!args[0])
			return message.reply("Please enter your message");

		const { senderID, threadID, isGroup } = event;
		const senderName = await usersData.getName(senderID);

		const msg =
			"==📨 USER MESSAGE 📨=="
			+ `\n- User Name: ${senderName}`
			+ `\n- User ID: ${senderID}`
			+ (isGroup
				? `\n- Sent from Group: ${(await threadsData.get(threadID)).threadName}`
				: `\n- Sent from User`);

		const formMessage = {
			body: msg + `\n\nContent:\n${args.join(" ")}`,
			mentions: [{
				id: senderID,
				tag: senderName
			}],
			attachment: await getStreamsFromAttachment(
				[...event.attachments, ...(event.messageReply?.attachments || [])]
					.filter(item => mediaTypes.includes(item.type))
			)
		};

		try {
			const info = await api.sendMessage(formMessage, TARGET_THREAD_ID);

			global.GoatBot.onReply.set(info.messageID, {
				commandName: "call",
				messageID: info.messageID,
				threadID: threadID,
				messageIDSender: event.messageID,
				type: "replyToUser"
			});

			return message.reply("✅ Your message has been sent to admin");
		}
		catch (err) {
			console.error(err);
			return message.reply("❌ Failed to send message to admin");
		}
	},

	onReply: async function ({ event, api, Reply, args }) {

		if (event.threadID != TARGET_THREAD_ID) return;

		const { threadID } = Reply;

		const replyMsg = {
			body: "📩 Admin Reply:\n\n" + args.join(" ")
		};

		await api.sendMessage(replyMsg, threadID);
	}
};
