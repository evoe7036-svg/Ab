const fs = require("fs-extra");

const EXPECTED_AUTHOR = "FARHAN-KHAN";

module.exports = {
	config: {
		name: "backupdata",
		version: "1.3",
		author: "FARHAN-KHAN", // 🔒 locked author
		countDown: 5,
		role: 2,
		description: {
			vi: "Sao lưu dữ liệu của bot (threads, users, dashboard, globalData)",
			en: "Backup data of bot (threads, users, dashboard, globalData)"
		},
		category: "owner",
		guide: {
			en: "   {pn}"
		}
	},

	langs: {
		vi: {
			backedUp: "Đã sao lưu dữ liệu của bot vào thư mục scripts/cmds/tmp"
		},
		en: {
			backedUp: "Bot data has been backed up to the scripts/cmds/tmp folder"
		}
	},

	onStart: async function ({ message, getLang, threadsData, usersData, dashBoardData, globalData }) {

		// 🔒 AUTHOR LOCK CHECK
		if (module.exports.config.author !== EXPECTED_AUTHOR) {
			return message.reply("⛔ FILE LOCKED: Author modified detected!");
		}

		// নিশ্চিত tmp folder আছে কিনা
		const tmpDir = `${__dirname}/tmp`;
		if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

		try {
			const [globalDataBackup, threadsDataBackup, usersDataBackup, dashBoardDataBackup] = await Promise.all([
				globalData.getAll(),
				threadsData.getAll(),
				usersData.getAll(),
				dashBoardData.getAll()
			]);

			const pathThreads = `${tmpDir}/threadsData.json`;
			const pathUsers = `${tmpDir}/usersData.json`;
			const pathDashBoard = `${tmpDir}/dashBoardData.json`;
			const pathGlobal = `${tmpDir}/globalData.json`;

			fs.writeFileSync(pathThreads, JSON.stringify(threadsDataBackup, null, 2));
			fs.writeFileSync(pathUsers, JSON.stringify(usersDataBackup, null, 2));
			fs.writeFileSync(pathDashBoard, JSON.stringify(dashBoardDataBackup, null, 2));
			fs.writeFileSync(pathGlobal, JSON.stringify(globalDataBackup, null, 2));

			message.reply({
				body: getLang("backedUp"),
				attachment: [
					fs.createReadStream(pathThreads),
					fs.createReadStream(pathUsers),
					fs.createReadStream(pathDashBoard),
					fs.createReadStream(pathGlobal)
				]
			});

		} catch (err) {
			console.log(err);
			message.reply("❌ Backup failed!");
		}
	}
};
