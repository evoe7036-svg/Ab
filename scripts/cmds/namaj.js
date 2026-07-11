const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "namaj",
    version: "14.0.0",
    author: "FARHAN-KHAN",
    countDown: 5,
    role: 0,
    shortDescription: "নামাজের সময়সূচী, জেলা এবং বর্তমান তারিখ",
    category: "islam",
    guide: "{p}namaj list অথবা {p}namaj [District Name]"
  },

  onStart: async function ({ api, event, args }) {
    const districts = ["Dhaka", "Chattogram", "Barisal", "Khulna", "Rajshahi", "Rangpur", "Sylhet", "Mymensingh"];
    let input = args.join(" ").trim();

    if (!input) {
      return api.sendMessage("❌ Please provide a district name. Example: /namaj Dhaka\nTo see list, type: /namaj list", event.threadID);
    }

    if (input.toLowerCase() === "list") {
      let msg = "📜 **Available Districts List:**\n━━━━━━━━━━━━━━━━━━━━\n";
      districts.forEach((d, i) => { msg += `${i + 1}. ${d}\n`; });
      msg += "\n━━━━━━━━━━━━━━━━━━━━\n💡 Type: /namaj [District Name] to see timings.";
      return api.sendMessage(msg, event.threadID);
    }

    const city = districts.find(d => d.toLowerCase() === input.toLowerCase());

    if (!city) {
      return api.sendMessage("❌ Please provide a district name. Example: /namaj Dhaka\nTo see list, type: /namaj list", event.threadID);
    }

    try {
      const res = await axios.get(`https://api.aladhan.com/v1/timingsByCity`, {
        params: {
          city: city,
          country: "Bangladesh",
          method: 1,      
          school: 1       
        }
      });

      const t = res.data.data.timings;
      const currentTime = moment.tz("Asia/Dhaka").format("hh:mm A");
      // আজকের তারিখ ফরম্যাট করা (যেমন: 19 February 2026)
      const currentDate = moment.tz("Asia/Dhaka").format("DD MMMM YYYY");

      const imageUrl = "https://i.imgur.com/0sh6Esb.jpeg"; 
      const image = await loadImage(imageUrl);
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // --- ১ নম্বর বক্স (নামাজের সময়) ---
      let box1Y = image.height / 5.5; 
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)"; 
      ctx.fillRect(60, box1Y, image.width - 120, 310);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.strokeRect(60, box1Y, image.width - 120, 310);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px Arial"; 
      let startY = box1Y + 40;
      
      const formatTime = (time) => moment(time, "HH:mm").format("hh:mm A");

      const times = [
        `✨ Fajr    : ${formatTime(t.Fajr)}`,
        `☀️ Dhuhr   : ${formatTime(t.Dhuhr)}`,
        `☁️ Asr     : ${formatTime(t.Asr)}`,
        `🌅 Maghrib : ${formatTime(t.Maghrib)}`,
        `🌙 Isha    : ${formatTime(t.Isha)}`,
        `🍱 Sehri   : ${formatTime(t.Imsak)}`,
        `🍱 Iftar   : ${formatTime(t.Maghrib)}`
      ];

      times.forEach(item => {
        ctx.fillText(item, 90, startY);
        startY += 40; 
      });

      // --- ২ নম্বর বক্স (জেলা, সময়, তারিখ এবং আপনার নাম) ---
      let box2Y = startY + 5;
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)"; 
      ctx.fillRect(60, box2Y, image.width - 120, 130); // বক্স বড় করা হয়েছে তারিখের জন্য
      ctx.strokeStyle = "#FFD700";
      ctx.strokeRect(60, box2Y, image.width - 120, 130);

      ctx.font = "bold 18px Arial";
      ctx.fillStyle = "#FFD700"; 
      ctx.fillText(`📍 District: ${city.toUpperCase()}`, 85, box2Y + 25);
      
      ctx.font = "bold 17px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`⌚ Time Now : ${currentTime}`, 85, box2Y + 50);
      ctx.fillText(`📅 Today    : ${currentDate}`, 85, box2Y + 75); // এখানে তারিখ যোগ করা হয়েছে
      
      // --- আপনার নাম (RAFI) ---
      ctx.font = "bold 16px Arial";
      ctx.fillStyle = "#00FF00"; 
      ctx.fillText(`👤 Owner    : RAFI`, 85, box2Y + 105);

      const cachePath = path.join(__dirname, "cache", `namaj_${Date.now()}.png`);
      fs.ensureDirSync(path.join(__dirname, "cache"));
      fs.writeFileSync(cachePath, canvas.toBuffer("image/png"));

      api.sendMessage({
        body: `🕌 Prayer timings for ${city.toUpperCase()}\n📅 Date: ${currentDate}`,
        attachment: fs.createReadStream(cachePath)
      }, event.threadID, () => fs.unlinkSync(cachePath));

    } catch (error) {
      api.sendMessage("❌ Error fetching data.", event.threadID);
    }
  }
};
