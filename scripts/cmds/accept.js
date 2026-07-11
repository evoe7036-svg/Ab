const moment = require("moment-timezone");

// 🔒 HARD AUTHOR LOCK
const AUTHOR = "FARHAN-KHAN";

module.exports = {
config: {
name: "accept",
aliases: ['acp', 'requests'],
version: "4.0",
author: AUTHOR, // 🔒 কেউ change করতে পারবে না
countDown: 60,
role: 0,
shortDescription: "Dark Luxury Friend Manager",
longDescription: "Manage friend requests with a premium dark Rolex UI and vibrant animal icons.",
category: "Utility",
},

// 🔒 FILE LOAD LOCK
onLoad: function () {
if (this.config.author !== AUTHOR) {
throw new Error("❌ AUTHOR NAME TAMPERED! FILE LOCKED.");
}
},

onReply: async function ({ message, Reply, event, api, commandName }) {

// 🔒 RUNTIME LOCK
if (this.config.author !== AUTHOR) {
return api.sendMessage("❌ AUTHOR NAME CHANGE DETECTED! COMMAND LOCKED.", event.threadID, event.messageID);
}

const { author, listRequest, messageID } = Reply;
if (author !== event.senderID) return;

const args = event.body.trim().split(/ +/);
const action = args[0].toLowerCase();

clearTimeout(Reply.unsendTimeout);

const form = {
av: api.getCurrentUserID(),
fb_api_caller_class: "RelayModern",
variables: {
input: {
source: "friends_tab",
actor_id: api.getCurrentUserID(),
client_mutation_id: Math.round(Math.random() * 19).toString()
},
scale: 3,
refresh_num: 0
}
};

const success = [];
const failed = [];

if (action === "add" || action === "accept") {
form.fb_api_req_friendly_name = "FriendingCometFriendRequestConfirmMutation";
form.doc_id = "3147613905362928";
} else if (action === "del" || action === "delete") {
form.fb_api_req_friendly_name = "FriendingCometFriendRequestDeleteMutation";
form.doc_id = "4108254489275063";
} else {
return api.sendMessage("┏━━━━━━━━━━━━━━━━━┓\n┃ ⚠️ WRONG ACTION \n┃ Use: [add] or [del]\n┗━━━━━━━━━━━━━━━━━┛", event.threadID, event.messageID);
}

let targetIDs = args.slice(1);
if (targetIDs[0] === "all") {
targetIDs = listRequest.map((_, index) => index + 1);
}

const newTargetIDs = [];
const promiseFriends = [];

for (const stt of targetIDs) {
const index = parseInt(stt) - 1;
const u = listRequest[index];
if (!u) continue;

let currentVars = JSON.parse(JSON.stringify(form.variables));
currentVars.input.friend_requester_id = u.node.id;

newTargetIDs.push(u.node.name);
promiseFriends.push(api.httpPost("https://www.facebook.com/api/graphql/", {
...form,
variables: JSON.stringify(currentVars)
}));
}

for (let i = 0; i < promiseFriends.length; i++) {
try {
const res = await promiseFriends[i];
if (JSON.parse(res).errors) failed.push(newTargetIDs[i]);
else success.push(newTargetIDs[i]);
} catch (e) {
failed.push(newTargetIDs[i]);
}
}

let report = `┏━━━━━━❰ ⚡ REPORT ❱━━━━━━┓\n`;
if (success.length > 0) report += `┃ ✅ SUCCESSFUL: ${success.length}\n`;
if (failed.length > 0) report += `┃ ❌ FAILED: ${failed.length}\n`;
report += `┗━━━━━━━━━━━━━━━━━━━━━━┛`;

api.sendMessage(report, event.threadID, event.messageID);
api.unsendMessage(messageID);
},

onStart: async function ({ event, api, commandName }) {

// 🔒 RUNTIME LOCK
if (this.config.author !== AUTHOR) {
return api.sendMessage("❌ AUTHOR NAME CHANGE DETECTED! COMMAND LOCKED.", event.threadID);
}

const form = {
av: api.getCurrentUserID(),
fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
fb_api_caller_class: "RelayModern",
doc_id: "4499164963466303",
variables: JSON.stringify({ input: { scale: 3 } })
};

try {
const response = await api.httpPost("https://www.facebook.com/api/graphql/", form);
const listRequest = JSON.parse(response).data.viewer.friending_possibilities.edges;

if (listRequest.length === 0) {
return api.sendMessage("┏━━━━━━❰ ROLEX BOT ❱━━━━━━┓\n┃ 📭 NO PENDING LIST \n┗━━━━━━━━━━━━━━━━━━━━━━┛", event.threadID);
}

let msg = `╔══════❰ ROLEX BOT ❱══════╗\n┃ 📋 𝐏𝐄𝐍𝐃𝐈𝐍𝐆: ${listRequest.length}\n┃ ━━━━━━━━━━━━━━━━━━━\n`;

listRequest.forEach((user, i) => {
msg += `┃ 🦜 ${i + 1}. **${user.node.name}**\n┃ 🦕 ID: ${user.node.id}\n┃ 🔗 LINK: fb.com/${user.node.id}\n┃ ━━━━━━━━━━━━━━━━━━━\n`;
});

msg += `┃ 💬 𝐑𝐄𝐏𝐋𝐘 𝐎𝐏𝐓𝐈𝐎𝐍𝐒:\n┃ 🦚 **add <num|all>** - Accept\n┃ 🐸 **del <num|all>** - Reject\n╚══════════════════════╝`;

api.sendMessage(msg, event.threadID, (e, info) => {
global.GoatBot.onReply.set(info.messageID, {
commandName,
messageID: info.messageID,
listRequest,
author: event.senderID,
unsendTimeout: setTimeout(() => {
api.unsendMessage(info.messageID);
}, this.config.countDown * 1000)
});
}, event.messageID);

} catch (err) {
api.sendMessage("┏━━━━━━❰ SYSTEM ❱━━━━━━┓\n┃ 🦖 DATABASE ERROR \n┗━━━━━━━━━━━━━━━━━━━━━┛", event.threadID);
}
}
};
